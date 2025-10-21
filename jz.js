/**
 * 完美禁止本地控制台 - js.js
 * 专注于禁用F12、右键、查看源代码、开发者工具
 */

(function() {
    'use strict';

    // ==================== 1. 禁用右键菜单 ====================
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    // ==================== 2. 禁用所有快捷键 ====================
    document.addEventListener('keydown', function(e) {
        const key = e.key ? e.key.toLowerCase() : '';
        const ctrl = e.ctrlKey;
        const shift = e.shiftKey;
        const alt = e.altKey;

        // F12 - 开发者工具
        if (e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // 所有F键 (F1-F12)
        if (e.keyCode >= 112 && e.keyCode <= 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        if (ctrl) {
            // Ctrl+Shift+I - 开发者工具
            if (shift && (key === 'i' || e.keyCode === 73)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+J - 控制台
            if (shift && (key === 'j' || e.keyCode === 74)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+C - 元素选择器
            if (shift && (key === 'c' || e.keyCode === 67)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+K - Firefox 控制台
            if (shift && (key === 'k' || e.keyCode === 75)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+U - 查看源代码
            if (key === 'u' || e.keyCode === 85) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+S - 保存页面
            if (key === 's' || e.keyCode === 83) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+P - 打印
            if (key === 'p' || e.keyCode === 80) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }

        // Ctrl+Shift+Delete - 清除浏览数据
        if (ctrl && shift && e.keyCode === 46) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // ==================== 3. 禁用选择文本 ====================
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    }, false);

    // 禁用鼠标拖拽选择
    document.onselectstart = function() {
        return false;
    };

    // CSS方式禁用选择
    const disableSelectStyle = document.createElement('style');
    disableSelectStyle.innerHTML = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }

        /* 允许输入框选择 */
        input, textarea {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
    `;
    document.head.appendChild(disableSelectStyle);

    // ==================== 4. 禁用复制、剪切、粘贴 ====================
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '');
        return false;
    }, true);

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // ==================== 5. 禁用拖拽 ====================
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    }, false);

    // ==================== 6. 检测开发者工具 - 方法1（Console检测）====================
    let devtoolsOpen = false;
    const checkElement = new Image();

    Object.defineProperty(checkElement, 'id', {
        get: function() {
            devtoolsOpen = true;
            throw new Error('DevTools detected');
        }
    });

    setInterval(function() {
        devtoolsOpen = false;
        console.dir(checkElement);
        console.clear();

        if (devtoolsOpen) {
            // 检测到开发者工具打开
            document.documentElement.innerHTML = '<body style="background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial;"><div style="text-align:center;"><h1>⚠️ 访问被拒绝</h1><p>检测到开发者工具已打开</p><p>请关闭后刷新页面</p></div></body>';
        }
    }, 1000);

    // ==================== 7. 检测开发者工具 - 方法2（尺寸检测）====================
    let checkDevToolsInterval = setInterval(function() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;

        if (widthThreshold || heightThreshold) {
            document.documentElement.innerHTML = '<body style="background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial;"><div style="text-align:center;"><h1>⚠️ 访问被拒绝</h1><p>检测到开发者工具已打开</p><p>请关闭后刷新页面</p></div></body>';
            clearInterval(checkDevToolsInterval);
        }
    }, 500);

    // ==================== 8. 检测开发者工具 - 方法3（Debugger陷阱）====================
    setInterval(function() {
        const before = new Date().getTime();
        debugger;
        const after = new Date().getTime();

        if (after - before > 100) {
            // Debugger被激活，说明开发者工具打开
            document.documentElement.innerHTML = '<body style="background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial;"><div style="text-align:center;"><h1>⚠️ 访问被拒绝</h1><p>检测到调试器已激活</p><p>请关闭后刷新页面</p></div></body>';
        }
    }, 1000);

    // ==================== 9. 检测开发者工具 - 方法4（性能检测）====================
    setInterval(function() {
        const before = performance.now();
        debugger;
        const after = performance.now();

        if (after - before > 100) {
            document.documentElement.innerHTML = '<body style="background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial;"><div style="text-align:center;"><h1>⚠️ 访问被拒绝</h1><p>检测到开发者工具</p><p>请关闭后刷新页面</p></div></body>';
        }
    }, 2000);

    // ==================== 10. 持续触发 Debugger ====================
    setInterval(function() {
        (function() {
            return false;
        })['constructor']('debugger')['call']();
    }, 50);

    // ==================== 11. 禁用控制台对象 ====================
    setTimeout(function() {
        // 先显示警告
        try {
            console.log('%c⚠️ 警告！', 'color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 4px #000;');
            console.log('%c请勿在此粘贴任何代码！', 'color: red; font-size: 30px; font-weight: bold;');
            console.log('%c使用控制台可能导致账户被盗或遭受攻击！', 'color: red; font-size: 20px;');
            console.log('%c如果有人让你在这里输入或粘贴内容，那是诈骗！', 'color: orange; font-size: 18px;');
        } catch(e) {}

        // 3秒后禁用所有console方法
        setTimeout(function() {
            const methods = [
                'log', 'debug', 'info', 'warn', 'error', 'table', 'trace',
                'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd',
                'time', 'timeEnd', 'timeLog', 'profile', 'profileEnd',
                'count', 'countReset', 'assert', 'clear'
            ];

            methods.forEach(function(method) {
                console[method] = function() {};
            });

            // 冻结console对象
            Object.freeze(console);
        }, 3000);
    }, 1000);

    // ==================== 12. 防止iframe嵌入 ====================
    if (window.self !== window.top) {
        try {
            window.top.location = window.self.location;
        } catch(e) {
            document.documentElement.innerHTML = '<body style="background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial;"><div style="text-align:center;"><h1>⚠️ 访问被拒绝</h1><p>此页面不允许在iframe中显示</p></div></body>';
        }
    }

    // ==================== 13. 禁用页面另存为 ====================
    window.addEventListener('beforeunload', function(e) {
        delete e['returnValue'];
    });

    // ==================== 14. 防止通过console调用window对象 ====================
    Object.defineProperty(window, 'console', {
        get: function() {
            throw new Error('Console access denied');
        },
        set: function() {
            throw new Error('Console modification denied');
        }
    });

    // ==================== 15. 检测 Chrome DevTools Protocol ====================
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        console.warn('检测到浏览器扩展');
    }

    // ==================== 16. 检测自动化工具 ====================
    if (navigator.webdriver) {
        document.documentElement.innerHTML = '<body style="background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial;"><div style="text-align:center;"><h1>⚠️ 访问被拒绝</h1><p>检测到自动化工具</p></div></body>';
    }

    // ==================== 17. 清空控制台历史 ====================
    setInterval(function() {
        try {
            console.clear();
        } catch(e) {}
    }, 100);

})();
