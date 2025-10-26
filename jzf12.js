(function() {
    'use strict';

    // ========== 核心工具函数 ==========
    const stop = (e) => { e.preventDefault(); e.stopPropagation(); return false; };
    const isEditable = (el) => el && (
        el.isContentEditable || 
        /^(INPUT|TEXTAREA)$/i.test(el.tagName) ||
        el.closest?.('.allow-select, [contenteditable], .CodeMirror, .monaco-editor')
    );
    const blockAlert = () => {
        document.documentElement.innerHTML = '<body style="background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial"><div style="text-align:center"><h1>⚠️ 访问被拒绝</h1><p>检测到非法访问行为</p><p>请关闭开发者工具后刷新页面</p></div></body>';
    };

    // ========== 1. 统一事件拦截器 ==========
    const blockEvent = (e) => !isEditable(e.target) && stop(e);
    ['contextmenu', 'copy', 'cut', 'dragstart', 'selectstart'].forEach(type => 
        document.addEventListener(type, blockEvent, true)
    );

    // ========== 2. 快捷键拦截 ==========
    document.addEventListener('keydown', (e) => {
        const {key = '', keyCode, ctrlKey, metaKey, shiftKey} = e;
        const k = key.toLowerCase();
        const mod = ctrlKey || metaKey;
      
        // F12 或 F1-F12 或 开发者工具快捷键
        if (keyCode === 123 || (keyCode >= 112 && keyCode <= 123) ||
            (mod && shiftKey && /^[ijck]$/.test(k)) ||
            (mod && /^[uspa]$/.test(k))) {
            if (!isEditable(e.target)) stop(e);
        }
    }, true);

    // ========== 3. 复制劫持 ==========
    document.addEventListener('copy', (e) => {
        if (!isEditable(e.target)) {
            stop(e);
            (e.clipboardData || window.clipboardData)?.setData('text/plain', '内容受保护，仅供浏览');
        }
    }, true);

    // ========== 4. 注入禁选样式（含Shadow DOM） ==========
    const css = `*{-webkit-user-select:none!important;user-select:none!important}input,textarea,[contenteditable],.allow-select,.CodeMirror,.monaco-editor{-webkit-user-select:text!important;user-select:text!important}::selection,::-moz-selection{background:transparent!important}img{pointer-events:none;-webkit-touch-callout:none}`;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Shadow DOM 注入
    const injectShadow = (root) => {
        if (!root || root.__protected) return;
        try {
            const s = document.createElement('style');
            s.textContent = css;
            root.appendChild(s);
            root.__protected = true;
        } catch(_) {}
    };
    const walkShadow = (node) => {
        if (node.shadowRoot) injectShadow(node.shadowRoot);
        node.querySelectorAll?.('*').forEach(el => el.shadowRoot && injectShadow(el.shadowRoot));
    };
    walkShadow(document);
    new MutationObserver(muts => 
        muts.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && walkShadow(n)))
    ).observe(document, {childList: true, subtree: true});

    // ========== 5. 开发者工具检测（三合一） ==========
    let devOpen = false;
    const check = new Image();
    Object.defineProperty(check, 'id', {
        get: () => { devOpen = true; throw new Error('DevTools'); }
    });

    setInterval(() => {
        // 检测1: Console
        devOpen = false;
        console.dir(check);
        console.clear();
      
        // 检测2: 窗口尺寸
        const widthDiff = window.outerWidth - window.innerWidth > 160;
        const heightDiff = window.outerHeight - window.innerHeight > 160;
      
        // 检测3: Debugger陷阱
        const t1 = performance.now();
        debugger;
        const t2 = performance.now();
      
        if (devOpen || widthDiff || heightDiff || (t2 - t1 > 100)) {
            blockAlert();
        }
    }, 1000);

    // 持续debugger干扰
    setInterval(() => {
        (function(){return false;})['constructor']('debugger')['call']();
    }, 50);

    // ========== 6. Console劫持 ==========
    setTimeout(() => {
        try {
            console.log('%c⚠️ 警告', 'color:red;font-size:50px;font-weight:bold');
            console.log('%c请勿在此粘贴任何代码！', 'color:red;font-size:30px');
        } catch(_) {}
      
        setTimeout(() => {
            ['log','debug','info','warn','error','table','trace','dir','dirxml','group',
             'groupCollapsed','groupEnd','time','timeEnd','profile','assert','clear']
            .forEach(m => console[m] = () => {});
            Object.freeze(console);
        }, 3000);
    }, 1000);

    // ========== 7. 防iframe嵌入 ==========
    if (window.self !== window.top) {
        try { window.top.location = window.self.location; } 
        catch(_) { blockAlert(); }
    }

    // ========== 8. 检测自动化工具 ==========
    if (navigator.webdriver) blockAlert();

    // ========== 9. 禁用控制台清理 ==========
    setInterval(() => { try { console.clear(); } catch(_) {} }, 100);

    // ========== 10. 控制台访问拦截 ==========
    try {
        Object.defineProperty(window, 'console', {
            get: () => { throw new Error('Console denied'); },
            set: () => { throw new Error('Console denied'); }
        });
    } catch(_) {}

    // ========== API暴露（可选） ==========
    window.AntiCopy = {
        disable: () => location.reload(),
        check: () => !devOpen
    };

    // 初始化完成标记
    console.log('%cProtection Active', 'color:green;font-size:12px');
})();
