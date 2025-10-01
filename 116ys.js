(function () {
  const REFRESH_INTERVAL = 500; // 毫秒
  const MAX_SPEED = 30 * 1024 * 1024; // 30MB/s

  // 公共（页面级）样式：只用于 host 而非内部字体颜色（内部由 shadow 控制）
  const globalStyle = document.createElement('style');
  globalStyle.textContent = `
    /* host 确保在背景上方且不阻塞点击 */
    .speed-host {
      display: inline-block;
      position: relative;
      z-index: 2147483647; /* 尽量置顶 */
      pointer-events: none; /* 不影响页面交互 */
      line-height: 1;
    }
  `;
  document.head.appendChild(globalStyle);

  function parseSpeed(speedStr) {
    if (!speedStr) return 0;
    const units = { 'B/s': 1, 'K/s': 1024, 'M/s': 1024 * 1024, 'G/s': 1024 * 1024 * 1024 };
    const regex = /^([\d.]+)([BKMG]\/s)$/;
    const match = String(speedStr).trim().match(regex);
    if (!match) return 0;
    return parseFloat(match[1]) * (units[match[2]] || 1);
  }

  function speedToColor(speed, maxSpeed, type) {
    const logSpeed = Math.log10(speed + 1);
    const logMax = Math.log10(maxSpeed + 1);
    const ratio = Math.min(logSpeed / logMax, 1);
    if (type === 'upload') {
      const r = 255;
      const g = Math.round(255 * (1 - ratio));
      const b = Math.round(255 * (1 - ratio));
      return `rgb(${r},${g},${b})`;
    } else {
      const r = Math.round(255 * (1 - ratio));
      const g = Math.round(255 * (1 - ratio));
      const b = 255;
      return `rgb(${r},${g},${b})`;
    }
  }

  // 确保某个速率元素里有我们的 shadow host（并返回 host 的 shadowRoot 和 inner 节点）
  function ensureShadowHost(speedElem) {
    // 如果已存在 speed-host，复用（避免重复创建）
    let host = speedElem.querySelector(':scope > .speed-host');
    if (host && host.shadowRoot) {
      return { host, shadow: host.shadowRoot, inner: host.shadowRoot.querySelector('.speed-inner') };
    }

    // 取原文本（防止覆盖重要结构，期望 speedElem 本身就是显示速率的纯文本容器）
    const originalText = speedElem.textContent.trim();

    // 清掉原内容并插入 host
    speedElem.innerHTML = ''; // 这里假定 speedElem 是专门放速率文本的节点
    host = document.createElement('span');
    host.className = 'speed-host';
    // attach shadow
    const shadow = host.attachShadow({ mode: 'open' });

    // shadow 内样式与结构（完全封装）
    const shStyle = document.createElement('style');
    shStyle.textContent = `
      .speed-inner {
        display: inline-block;
        padding: 0 6px;
        border-radius: 4px;
        font-weight: 700;
        line-height: 1;
        background: rgba(0,0,0,0.32); /* 半透明底，方便识别 */
        text-shadow: 0 0 3px rgba(0,0,0,0.9);
        transition: color 0.5s ease, transform 0.4s ease, background 0.4s ease;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        pointer-events: none;
      }
      @keyframes flash-soft { 0%,100%{opacity:1;}50%{opacity:0.6;} }
      @keyframes flash-fast { 0%,100%{opacity:1;}50%{opacity:0.2;} }
      .boost-1 { animation: flash-soft 1s infinite; }
      .boost-2 { animation: flash-fast 0.7s infinite; transform-origin: center; }
      .boost-3 { animation: flash-fast 0.5s infinite; transform-origin: center; }
    `;

    const inner = document.createElement('span');
    inner.className = 'speed-inner';
    inner.textContent = originalText;

    shadow.appendChild(shStyle);
    shadow.appendChild(inner);
    speedElem.appendChild(host);

    return { host, shadow, inner };
  }

  function applyBoostClass(innerElem, speed, type) {
    innerElem.classList.remove('boost-1', 'boost-2', 'boost-3');
    if (speed > 30 * 1024 * 1024) {
      innerElem.classList.add('boost-3');
      innerElem.style.transform = 'scale(1.12)';
      innerElem.style.background = (type === 'upload') ? 'rgba(255,0,0,0.12)' : 'rgba(0,0,255,0.12)';
    } else if (speed > 20 * 1024 * 1024) {
      innerElem.classList.add('boost-2');
      innerElem.style.transform = 'scale(1.04)';
      innerElem.style.background = (type === 'upload') ? 'rgba(255,0,0,0.08)' : 'rgba(0,0,255,0.08)';
    } else if (speed > 10 * 1024 * 1024) {
      innerElem.classList.add('boost-1');
      innerElem.style.transform = 'scale(1.00)';
      innerElem.style.background = (type === 'upload') ? 'rgba(255,0,0,0.06)' : 'rgba(0,0,255,0.06)';
    } else {
      innerElem.style.transform = 'none';
      innerElem.style.background = 'rgba(0,0,0,0.32)';
    }
  }

  function updateSpeedDisplay() {
    const cards = document.querySelectorAll('div.rounded-lg.border.bg-card.text-card-foreground.shadow-lg');
    cards.forEach(card => {
      const speedElems = card.querySelectorAll(
        'section.grid.grid-cols-5 > div.flex.flex-col > div.flex.items-center.text-xs.font-semibold'
      );
      if (!speedElems || speedElems.length < 5) return;

      const uploadElem = speedElems[3];
      const downloadElem = speedElems[4];
      const uploadStr = uploadElem.textContent.trim();
      const downloadStr = downloadElem.textContent.trim();

      const uploadSpeed = parseSpeed(uploadStr);
      const downloadSpeed = parseSpeed(downloadStr);

      // ensure shadow hosts
      const up = ensureShadowHost(uploadElem);
      const dl = ensureShadowHost(downloadElem);

      // 更新文字（保持原始格式为纯文本）
      up.inner.textContent = uploadStr;
      dl.inner.textContent = downloadStr;

      // 颜色设置（直接在 shadow 内更新，不会被外部 CSS 覆盖）
      up.inner.style.color = speedToColor(uploadSpeed, MAX_SPEED, 'upload');
      dl.inner.style.color = speedToColor(downloadSpeed, MAX_SPEED, 'download');

      // 过渡
      up.inner.style.transition = 'color 0.4s ease, transform 0.4s ease, background 0.4s ease';
      dl.inner.style.transition = 'color 0.4s ease, transform 0.4s ease, background 0.4s ease';

      // 应用动画/背景等级
      applyBoostClass(up.inner, uploadSpeed, 'upload');
      applyBoostClass(dl.inner, downloadSpeed, 'download');
    });
  }

  // 周期性刷新
  setInterval(() => {
    if (!document.hidden) updateSpeedDisplay();
  }, REFRESH_INTERVAL);

  // 首次立即执行一次
  updateSpeedDisplay();
})();
