(function () {
  // 刷新间隔（毫秒）
  const REFRESH_INTERVAL = 500;
  const MAX_SPEED = 30 * 1024 * 1024; // 30MB/s 上限

  // 注入基础样式（尽量轻量，实际可视样式通过 inline setProperty 强制）
  const style = document.createElement('style');
  style.id = '__speed_style_by_name_pattern';
  style.textContent = `
    @keyframes flash-soft { 0%,100%{opacity:1;}50%{opacity:0.6;} }
    @keyframes flash-fast { 0%,100%{opacity:1;}50%{opacity:0.2;} }

    /* 特效类（保留原逻辑，仅控制动画） */
    .speed-boost-1 { font-weight:bold; animation: flash-soft 1s infinite; }
    .speed-boost-2 { font-weight:bold; animation: flash-fast 0.7s infinite; transform-origin:center; }
    .speed-boost-3 { font-weight:bold; animation: flash-fast 0.5s infinite; transform-origin:center; }

    .speed-boost-1-dl { font-weight:bold; animation: flash-soft 1s infinite; }
    .speed-boost-2-dl { font-weight:bold; animation: flash-fast 0.7s infinite; transform-origin:center; }
    .speed-boost-3-dl { font-weight:bold; animation: flash-fast 0.5s infinite; transform-origin:center; }

    /* 内层包裹基础类（视觉增强由 inline 样式强制）*/
    .speed-inner {
      border-radius: 4px;
      padding: 0 4px;
      display: inline-block;
      transition: color 0.4s ease, transform 0.35s ease, background 0.35s ease;
      pointer-events: none;
    }
  `;
  // 避免重复注入
  if (!document.getElementById(style.id)) document.head.appendChild(style);

  // 解析速度字符串 -> 字节/秒
  function parseSpeed(speedStr) {
    if (!speedStr) return 0;
    const units = { 'B/s': 1, 'K/s': 1024, 'M/s': 1024 * 1024, 'G/s': 1024 * 1024 * 1024 };
    const regex = /^([\d.]+)\s*([BKMG]\/s)$/i;
    const match = String(speedStr || '').trim().match(regex);
    if (!match) return 0;
    return parseFloat(match[1]) * (units[match[2].toUpperCase()] || 1);
  }

  // 对数映射颜色（白->红 或 白->蓝）
  function speedToColor(speed, maxSpeed, type) {
    const logSpeed = Math.log10((speed || 0) + 1);
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

  // 根据速率给元素添加特效类（仅动画类）
  function applyEffectClass(elem, speed, type) {
    elem.classList.remove('speed-boost-1','speed-boost-2','speed-boost-3',
                         'speed-boost-1-dl','speed-boost-2-dl','speed-boost-3-dl');
    if (speed > 30 * 1024 * 1024) {
      elem.classList.add(type === 'upload' ? 'speed-boost-3' : 'speed-boost-3-dl');
      elem.style.transform = 'scale(1.12)';
    } else if (speed > 20 * 1024 * 1024) {
      elem.classList.add(type === 'upload' ? 'speed-boost-2' : 'speed-boost-2-dl');
      elem.style.transform = 'scale(1.04)';
    } else if (speed > 10 * 1024 * 1024) {
      elem.classList.add(type === 'upload' ? 'speed-boost-1' : 'speed-boost-1-dl');
      elem.style.transform = 'none';
    } else {
      elem.style.transform = 'none';
    }
  }

  // 为目标速率元素确保存在内层 span.speed-inner，并返回该 span
  function ensureInnerSpan(speedElem) {
    if (!speedElem) return null;
    // 只检查直接子级，避免替换过多结构
    let inner = speedElem.querySelector(':scope > .speed-inner');
    if (!inner) {
      // 保守取得原文本（如有 HTML 结构会被清掉——此处假设元素仅显示速率文本）
      const text = speedElem.textContent.trim();
      speedElem.innerHTML = `<span class="speed-inner">${text}</span>`;
      inner = speedElem.querySelector(':scope > .speed-inner');
    }
    return inner;
  }

  // 主刷新函数：更新所有卡片内的上传/下载速率显示
  function updateSpeedColors() {
    // 选择服务器卡片（与你原来选择器一致）
    const cards = document.querySelectorAll('div.rounded-lg.border.bg-card.text-card-foreground.shadow-lg');
    cards.forEach(card => {
      const speedElems = card.querySelectorAll(
        'section.grid.grid-cols-5 > div.flex.flex-col > div.flex.items-center.text-xs.font-semibold'
      );
      if (!speedElems || speedElems.length < 5) return;

      const uploadElem = speedElems[3];   // 上传
      const downloadElem = speedElems[4]; // 下载
      if (!uploadElem || !downloadElem) return;

      const uploadText = uploadElem.textContent.trim();
      const downloadText = downloadElem.textContent.trim();
      const uploadSpeed = parseSpeed(uploadText);
      const downloadSpeed = parseSpeed(downloadText);

      // 确保内层 span（避免被父级样式覆盖）
      const upInner = ensureInnerSpan(uploadElem);
      const dlInner = ensureInnerSpan(downloadElem);
      if (!upInner || !dlInner) return;

      // 更新文字（保持原文本）
      upInner.textContent = uploadText;
      dlInner.textContent = downloadText;

      // 强制设置颜色并提高优先级（与名字脚本同样稳妥）
      const upColor = speedToColor(uploadSpeed, MAX_SPEED, 'upload');
      const dlColor = speedToColor(downloadSpeed, MAX_SPEED, 'download');

      upInner.style.setProperty('color', upColor, 'important');
      dlInner.style.setProperty('color', dlColor, 'important');

      // 阻止 mix-blend-mode 干扰，并增加可读性（描边 + 半透明背景）
      upInner.style.setProperty('mix-blend-mode', 'normal', 'important');
      dlInner.style.setProperty('mix-blend-mode', 'normal', 'important');

      upInner.style.setProperty('text-shadow', '0 0 3px rgba(0,0,0,0.9)', 'important');
      dlInner.style.setProperty('text-shadow', '0 0 3px rgba(0,0,0,0.9)', 'important');

      upInner.style.setProperty('background-color', 'rgba(0,0,0,0.28)', 'important');
      dlInner.style.setProperty('background-color', 'rgba(0,0,0,0.28)', 'important');

      upInner.style.setProperty('padding', '0 4px', 'important');
      dlInner.style.setProperty('padding', '0 4px', 'important');

      upInner.style.setProperty('border-radius', '4px', 'important');
      dlInner.style.setProperty('border-radius', '4px', 'important');

      // 过渡（光滑变化）
      upInner.style.transition = 'color 0.45s ease, transform 0.35s ease, background 0.35s ease';
      dlInner.style.transition = 'color 0.45s ease, transform 0.35s ease, background 0.35s ease';

      // 应用动画类与缩放（在 inner 上）
      applyEffectClass(upInner, uploadSpeed, 'upload');
      applyEffectClass(dlInner, downloadSpeed, 'download');
    });
  }

  // MutationObserver：当 DOM 发生变动时重新应用（防止框架重建导致样式丢失）
  const observer = new MutationObserver((mutations) => {
    // 简单节流：只在有新增/删除或属性变化时触发全量刷新
    let trigger = false;
    for (const m of mutations) {
      if (m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)) { trigger = true; break; }
      if (m.type === 'attributes') { trigger = true; break; }
    }
    if (trigger) {
      // 使用微任务稍作缓冲，避免高频 DOM 变化导致卡顿
      Promise.resolve().then(updateSpeedColors);
    }
  });
  try {
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
  } catch (e) {
    // 如果 observe 失败（例如在某些特殊环境），仍然保留定时器兜底
    console.warn('Speed observer failed:', e);
  }

  // 定时刷新（兜底 + 主刷新逻辑）
  updateSpeedColors();
  setInterval(() => {
    if (!document.hidden) updateSpeedColors();
  }, REFRESH_INTERVAL);

  // 暴露调试方法（可在控制台执行 window.__updateSpeedColors() 手动触发）
  try { window.__updateSpeedColors = updateSpeedColors; } catch (e) {}
})();
