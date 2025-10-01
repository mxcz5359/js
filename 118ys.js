// 终极版：Shadow DOM + MutationObserver（复制整段替换原来的）
(function () {
  const MAX_SPEED = 30 * 1024 * 1024;
  const OBS_OPTIONS = { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] };

  function parseSpeed(speedStr) {
    if (!speedStr) return 0;
    const units = { 'B/s': 1, 'K/s': 1024, 'M/s': 1024 * 1024, 'G/s': 1024 * 1024 * 1024 };
    const match = String(speedStr).trim().match(/^([\d.]+)([BKMG]\/s)$/);
    if (!match) return 0;
    return parseFloat(match[1]) * (units[match[2]] || 1);
  }

  function speedToColor(speed, maxSpeed, type) {
    const logSpeed = Math.log10(speed + 1);
    const logMax = Math.log10(maxSpeed + 1);
    const ratio = Math.min(logSpeed / logMax, 1);
    if (type === 'upload') {
      const r = 255, g = Math.round(255 * (1 - ratio)), b = Math.round(255 * (1 - ratio));
      return `rgb(${r},${g},${b})`;
    } else {
      const r = Math.round(255 * (1 - ratio)), g = Math.round(255 * (1 - ratio)), b = 255;
      return `rgb(${r},${g},${b})`;
    }
  }

  // 创建 page-level host 样式（host 本身在外面但内部样式在 shadow）
  (function injectHostStyle() {
    if (document.getElementById('__speed_host_global_style')) return;
    const s = document.createElement('style');
    s.id = '__speed_host_global_style';
    s.textContent = `
      .__speed_host {
        display:inline-block;
        position:relative;
        z-index:2147483646;
        pointer-events:none;
        line-height:1;
      }
    `;
    document.head.appendChild(s);
  })();

  // 在 speedElem 内确保存在 shadow host，返回 inner span
  function ensureShadowHost(speedElem) {
    if (!speedElem) return null;
    // 如果被替换过，可能已有直接子元素 .__speed_host
    let host = speedElem.querySelector(':scope > .__speed_host');
    if (!host) {
      // 取纯文本（保守：只取文本内容）
      const original = speedElem.textContent.trim();
      // 清空并插入 host
      speedElem.innerHTML = '';
      host = document.createElement('span');
      host.className = '__speed_host';
      // attach shadow
      const shadow = host.attachShadow({ mode: 'open' });
      const shStyle = document.createElement('style');
      shStyle.textContent = `
        .speed-inner {
          display:inline-block;
          padding:0 6px;
          border-radius:4px;
          font-weight:700;
          background: rgba(0,0,0,0.32);
          text-shadow:0 0 3px rgba(0,0,0,0.9);
          transition: color 0.35s ease, transform 0.35s ease, background 0.35s ease;
          -webkit-font-smoothing:antialiased;
          pointer-events:none;
        }
        @keyframes flash-soft {0%,100%{opacity:1;}50%{opacity:0.6;}}
        @keyframes flash-fast {0%,100%{opacity:1;}50%{opacity:0.2;}}
        .boost1{animation:flash-soft 1s infinite;}
        .boost2{animation:flash-fast 0.7s infinite;}
        .boost3{animation:flash-fast 0.5s infinite;}
      `;
      const inner = document.createElement('span');
      inner.className = 'speed-inner';
      inner.textContent = original;
      shadow.appendChild(shStyle);
      shadow.appendChild(inner);
      speedElem.appendChild(host);
      return inner;
    } else {
      // 已存在：返回 shadow 内部的 .speed-inner（若丢失，重建）
      const shadow = host.shadowRoot;
      if (!shadow) return null;
      let inner = shadow.querySelector('.speed-inner');
      if (!inner) {
        inner = document.createElement('span');
        inner.className = 'speed-inner';
        inner.textContent = speedElem.textContent.trim();
        shadow.appendChild(inner);
      }
      return inner;
    }
  }

  function applyBoost(inner, speed, type) {
    inner.classList.remove('boost1', 'boost2', 'boost3');
    if (speed > 30 * 1024 * 1024) {
      inner.classList.add('boost3');
      inner.style.transform = 'scale(1.12)';
      inner.style.background = (type === 'upload') ? 'rgba(255,0,0,0.12)' : 'rgba(0,0,255,0.12)';
    } else if (speed > 20 * 1024 * 1024) {
      inner.classList.add('boost2');
      inner.style.transform = 'scale(1.04)';
      inner.style.background = (type === 'upload') ? 'rgba(255,0,0,0.08)' : 'rgba(0,0,255,0.08)';
    } else if (speed > 10 * 1024 * 1024) {
      inner.classList.add('boost1');
      inner.style.transform = 'scale(1.00)';
      inner.style.background = (type === 'upload') ? 'rgba(255,0,0,0.06)' : 'rgba(0,0,255,0.06)';
    } else {
      inner.style.transform = 'none';
      inner.style.background = 'rgba(0,0,0,0.32)';
    }
  }

  // 处理所有卡片（或单个节点）
  function processCard(card) {
    try {
      const speedElems = card.querySelectorAll('section.grid.grid-cols-5 > div.flex.flex-col > div.flex.items-center.text-xs.font-semibold');
      if (!speedElems || speedElems.length < 5) return;
      // 上传在索引3，下载在索引4（你页面原先的结构）
      const uploadElem = speedElems[3];
      const downloadElem = speedElems[4];
      if (!uploadElem || !downloadElem) return;

      const uploadText = uploadElem.textContent.trim();
      const downloadText = downloadElem.textContent.trim();
      const uploadSpeed = parseSpeed(uploadText);
      const downloadSpeed = parseSpeed(downloadText);

      const upInner = ensureShadowHost(uploadElem);
      const dlInner = ensureShadowHost(downloadElem);
      if (!upInner || !dlInner) return;

      upInner.textContent = uploadText;
      dlInner.textContent = downloadText;

      // 在 shadow 内设置颜色（不会被外部 CSS 覆盖）
      upInner.style.color = speedToColor(uploadSpeed, MAX_SPEED, 'upload');
      dlInner.style.color = speedToColor(downloadSpeed, MAX_SPEED, 'download');

      applyBoost(upInner, uploadSpeed, 'upload');
      applyBoost(dlInner, downloadSpeed, 'download');
    } catch (e) {
      console.warn('processCard error', e);
    }
  }

  // 批量处理当前所有卡片
  function processAll() {
    const cards = document.querySelectorAll('div.rounded-lg.border.bg-card.text-card-foreground.shadow-lg');
    if (!cards || cards.length === 0) {
      // 打印调试信息，帮助定位问题
      // console.log('No matching cards found. Selector may be different on your page.');
    }
    cards.forEach(processCard);
  }

  // MutationObserver：监听 DOM 变化并更新受影响的卡片
  const observer = new MutationObserver(muts => {
    // 速率受页面频繁更新影响时，这里会响应并处理
    // 为性能起见只在有关键变化时触发全量处理
    let touched = false;
    for (const m of muts) {
      if (m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)) touched = true;
      if (m.type === 'attributes') touched = true;
      if (touched) break;
    }
    if (touched) {
      // 使用 requestIdleCallback / setTimeout 限频
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(processAll, { timeout: 300 });
      } else {
        setTimeout(processAll, 60);
      }
    }
  });
  try {
    observer.observe(document.documentElement || document.body, OBS_OPTIONS);
  } catch (e) {
    console.warn('observer.observe failed', e);
  }

  // 首次执行 + 定时兜底
  processAll();
  const interval = setInterval(processAll, 800);

  // 如果你需要停用脚本，可在控制台执行： clearInterval(<返回的 interval 变量>)
  // 这里只把 interval 暴露在 window 以便调试（可选）
  try { window.__speed_overlay_interval = interval; window.__speed_overlay_observer = observer; } catch(e){}
})();
