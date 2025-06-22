window.CustomBackgroundImage="https://api.vvhan.com/api/wallpaper/acg"; /* 页面背景图 */
window.CustomLogo = "https://raw.githubusercontent.com/mxcz5359/surge/refs/heads/main/favicon.ico"; /* 自定义Logo */
window.ShowNetTransfer  = "true"; /* 卡片显示上下行流量 */
/*window.DisableAnimatedMan  = "true";*/     /* 关掉动画人物插图 */
window.CustomIllustration = 'https://raw.githubusercontent.com/mxcz5359/clash/refs/heads/main/nz2.png';
window.CustomDesc ="MyVps"; /* 自定义描述 */
window.CustomLinks = '[{"link":"https://mybox.mxcz.xyz:5359/","name":"Mybox"},{"link":"https://ai.mxcz.xyz:5359/","name":"Ai"}]';

// 自定义字体：LXGW WenKai
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/style.css';
document.head.appendChild(link);

const selectorButton = '#root > div > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > section > div.flex.justify-center.w-full.max-w-\\[200px\\] > div > div > div.relative.cursor-pointer.rounded-3xl.px-2\\.5.py-\\[8px\\].text-\\[13px\\].font-\\[600\\].transition-all.duration-500.text-stone-400.dark\\:text-stone-500';
const selectorSection = '#root > div > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > section';
const selector3 = '#root > div > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > div:nth-child(3)';
const selector4 = '#root > div > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > div:nth-child(4)';

let hasClicked = false;
let divVisible = false;
let swapping = false;

function forceBothVisible() {
  const div3 = document.querySelector(selector3);
  const div4 = document.querySelector(selector4);
  if (div3 && div4) {
    div3.style.display = 'block';
    div4.style.display = 'block';
  }
}

function hideSection() {
  const section = document.querySelector(selectorSection);
  if (section) {
    section.style.display = 'none';
  }
}

function tryClickButton() {
  const btn = document.querySelector(selectorButton);
  if (btn && !hasClicked) {
    btn.click();
    hasClicked = true;
    setTimeout(forceBothVisible, 500);
  }
}

function swapDiv3AndDiv4() {
  if (swapping) return;
  swapping = true;

  const div3 = document.querySelector(selector3);
  const div4 = document.querySelector(selector4);
  if (!div3 || !div4) {
    swapping = false;
    return;
  }
  const parent = div3.parentNode;
  if (parent !== div4.parentNode) {
    swapping = false;
    return;
  }

  // 交换 div3 和 div4 的位置
  parent.insertBefore(div4, div3);
  parent.insertBefore(div3, div4.nextSibling);

  swapping = false;
}

const observer = new MutationObserver(() => {
  const div3 = document.querySelector(selector3);
  const div4 = document.querySelector(selector4);

  const isDiv3Visible = div3 && getComputedStyle(div3).display !== 'none';
  const isDiv4Visible = div4 && getComputedStyle(div4).display !== 'none';

  const isAnyDivVisible = isDiv3Visible || isDiv4Visible;

  if (isAnyDivVisible && !divVisible) {
    hideSection();
    tryClickButton();
    setTimeout(swapDiv3AndDiv4, 100); 
  } else if (!isAnyDivVisible && divVisible) {
    hasClicked = false;
  }

  divVisible = isAnyDivVisible;

  if (div3 && div4) {
    if (!isDiv3Visible || !isDiv4Visible) {
      forceBothVisible();
    }
  }
});

const root = document.querySelector('#root');
if (root) {
  observer.observe(root, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ['style', 'class']
  });
}

// 新增的图片观察器
var imgObserver = new MutationObserver(function(mutationsList, observer) {
  var xpath = "/html/body/div/div/main/div[2]/section[1]/div[4]/div";
  var container = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  if (container) {
    observer.disconnect();
    var existingImg = container.querySelector("img");
    if (existingImg) {
      container.removeChild(existingImg);
    }
    var imgElement = document.createElement("img");
    imgElement.src = "https://raw.githubusercontent.com/mxcz5359/clash/refs/heads/main/nz2.png";
    imgElement.style.position = "absolute";
    imgElement.style.right = "-20px";
    imgElement.style.top = "-70px";
    imgElement.style.zIndex = "10";
    imgElement.style.width = "100px";  // ⭐️ 这里直接控制卡通人物宽度（高度会自动等比缩放）
    container.appendChild(imgElement);
  }
});

// 启动图片观察器
imgObserver.observe(document.body, {
  childList: true,
  subtree: true
});

/* 卡片显示上下行流量 */
//window.ShowNetTransfer = "true";

;(function () {
    let trafficTimer = null;
    let trafficCache = null;

    const config = {
      showTrafficStats: true,
      insertPosition: 'replace', // 可选：'after', 'before', 'replace'
      interval: 60000,           // 60秒刷新周期
      style: 1
    };

    function formatFileSize(bytes) {
      if (bytes === 0) return { value: '0', unit: 'B' };
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      let unitIndex = 0;
      let size = bytes;
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      return {
        value: size.toFixed(unitIndex === 0 ? 0 : 2),
        unit: units[unitIndex]
      };
    }

    function calculatePercentage(used, total) {
      used = Number(used);
      total = Number(total);
      if (used > 1e15 || total > 1e15) {
        used /= 1e10;
        total /= 1e10;
      }
      return (used / total * 100).toFixed(1);
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }

    function safeSetTextContent(parent, selector, text) {
      const el = parent.querySelector(selector);
      if (el) {
        el.textContent = text;
      }
    }
    // 返回进度条颜色：绿色（0%）到红色（100%）
    function getGradientColor(percentage) {
      const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
      const lerp = (start, end, t) => Math.round(start + (end - start) * t);
      const p = clamp(Number(percentage), 0, 100) / 100;
      const startColor = { r: 16, g: 185, b: 129 }; // #10b981
      const endColor = { r: 239, g: 68, b: 68 };  // #ef4444
      const r = lerp(startColor.r, endColor.r, p);
      const g = lerp(startColor.g, endColor.g, p);
      const b = lerp(startColor.b, endColor.b, p);
      return `rgb(${r}, ${g}, ${b})`;
    }

    function renderTrafficStats(trafficData) {
      const serverMap = new Map();

      for (const cycleId in trafficData) {
        const cycle = trafficData[cycleId];
        if (!cycle.server_name || !cycle.transfer) continue;

        for (const serverId in cycle.server_name) {
          const serverName = cycle.server_name[serverId];
          const transfer = cycle.transfer[serverId];
          const max = cycle.max;
          const from = cycle.from;
          const to = cycle.to;
          const next_update = cycle.next_update[serverId];

          if (serverName && transfer !== undefined && max && from && to) {
            serverMap.set(serverName, {
              id: serverId,
              transfer: transfer,
              max: max,
              name: cycle.name,
              from: from,
              to: to,
              next_update: next_update
            });
          }
        }
      }

      serverMap.forEach((serverData, serverName) => {
        const targetElement = Array.from(document.querySelectorAll('section.grid.items-center.gap-2'))
          .find(section => {
            const firstText = section.querySelector('p.break-all.font-bold.tracking-tight.text-xs')?.textContent.trim();
            return firstText === serverName;
          });
        if (!targetElement) {
          //console.warn(`[renderTrafficStats] 未找到服务器 "${serverName}" (ID: ${serverData.id}) 的元素`);
          return;
        }

        const usedFormatted = formatFileSize(serverData.transfer);
        const totalFormatted = formatFileSize(serverData.max);
        const percentage = calculatePercentage(serverData.transfer, serverData.max);
        const fromFormatted = formatDate(serverData.from);
        const toFormatted = formatDate(serverData.to);
        const next_update = new Date(serverData.next_update).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
        const uniqueClassName = 'traffic-stats-for-server-' + serverData.id;
        const progressColor = getGradientColor(percentage);
        let insertPosition = config.insertPosition;

        const containerDiv = targetElement.closest('div');
        if (!containerDiv) return;

        const existing = Array.from(containerDiv.querySelectorAll('.new-inserted-element')).find(el =>
          el.classList.contains(uniqueClassName)
        );
        if (!config.showTrafficStats) {
          if (existing) existing.remove();
          return;
        }

        if (existing) {
          safeSetTextContent(existing, '.used-traffic', usedFormatted.value);
          safeSetTextContent(existing, '.used-unit', usedFormatted.unit);
          safeSetTextContent(existing, '.total-traffic', totalFormatted.value);
          safeSetTextContent(existing, '.total-unit', totalFormatted.unit);
          safeSetTextContent(existing, '.from-date', fromFormatted);
          safeSetTextContent(existing, '.to-date', toFormatted);
          safeSetTextContent(existing, '.percentage-value', percentage + '%');
          safeSetTextContent(existing, '.next-update', `next update: ${next_update}`);
          const progressBar = existing.querySelector('.progress-bar');
          if (progressBar) {
            progressBar.style.width = percentage + '%';
            progressBar.style.backgroundColor = progressColor;
          }
          console.log(`[renderTrafficStats] 更新已存在的流量条目: ${serverName}`);
        }
        else {
          let oldSection = containerDiv.querySelector('section.flex.items-center.w-full.justify-between.gap-1');
          if (!oldSection) {
            oldSection = containerDiv.querySelector('section.grid.items-center.gap-3');
            insertPosition = 'after';
          }
          if (!oldSection) return;

          const newElement = document.createElement('div');
          newElement.classList.add('space-y-1.5', 'new-inserted-element', uniqueClassName);
          newElement.style.width = '100%';
          if (config.style === 1) {
            newElement.innerHTML = `
                <div class="flex items-center justify-between">
                  <div class="flex items-baseline gap-1">
                    <span class="text-[10px] font-medium text-neutral-800 dark:text-neutral-200 used-traffic">${usedFormatted.value}</span>
                    <span class="text-[10px] font-medium text-neutral-800 dark:text-neutral-200 used-unit">${usedFormatted.unit}</span>
                    <span class="text-[10px] text-neutral-500 dark:text-neutral-400">/ </span>
                    <span class="text-[10px] text-neutral-500 dark:text-neutral-400 total-traffic">${totalFormatted.value}</span>
                    <span class="text-[10px] text-neutral-500 dark:text-neutral-400 total-unit">${totalFormatted.unit}</span>
                  </div>
                  <div class="text-[10px] font-medium text-neutral-600 dark:text-neutral-300">
                    <span class="from-date">${fromFormatted}</span>
                    <span class="text-neutral-500 dark:text-neutral-400">-</span>
                    <span class="to-date">${toFormatted}</span>
                  </div>
                </div>
                <div class="relative h-1.5">
                  <div class="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-full"></div>
                  <div class="absolute inset-0 bg-emerald-500 rounded-full transition-all duration-300 progress-bar" style="width: ${percentage}%; background-color: ${progressColor};"></div>
                </div>
              `;
          } else if (config.style === 2) {
            newElement.innerHTML = `
                <div class="flex items-center justify-between">
                  <div class="flex items-baseline gap-1">
                    <span class="text-[10px] font-medium text-neutral-800 dark:text-neutral-200 used-traffic">${usedFormatted.value}</span>
                    <span class="text-[10px] font-medium text-neutral-800 dark:text-neutral-200 used-unit">${usedFormatted.unit}</span>
                    <span class="text-[10px] text-neutral-500 dark:text-neutral-400">/ </span>
                    <span class="text-[10px] text-neutral-500 dark:text-neutral-400 total-traffic">${totalFormatted.value}</span>
                    <span class="text-[10px] text-neutral-500 dark:text-neutral-400 total-unit">${totalFormatted.unit}</span>
                  </div>
                  <span class="text-[10px] text-neutral-500 dark:text-neutral-400 percentage-value">${percentage}%</span>
                </div>
                <div class="relative h-1.5">
                  <div class="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 rounded-full"></div>
                  <div class="absolute inset-0 bg-emerald-500 rounded-full transition-all duration-300 progress-bar" style="width: ${percentage}%; background-color: ${progressColor};"></div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-[10px] text-neutral-500 dark:text-neutral-400">
                    <span class="from-date">${fromFormatted}</span>
                    <span class="text-neutral-500 dark:text-neutral-400">-</span>
                    <span class="to-date">${toFormatted}</span>
                  </div>
                  <span class="text-[10px] text-neutral-500 dark:text-neutral-400">next update: ${next_update}</span>
                </div>
              `;
          }
          if (insertPosition === 'before') oldSection.before(newElement);
          else if (insertPosition === 'replace') oldSection.replaceWith(newElement);
          else oldSection.after(newElement);
          console.log(`[renderTrafficStats] 插入新流量条目: ${serverName}，插入方式: ${insertPosition}`);
        }
      });
    }

    function updateTrafficStats(force = false) {
      const now = Date.now();
      if (!force && trafficCache && (now - trafficCache.timestamp < config.interval)) {
        console.log('[updateTrafficStats] 使用缓存数据');
        renderTrafficStats(trafficCache.data);
        return;
      }

      console.log('[updateTrafficStats] 正在请求新数据...');
      fetch('/api/v1/service')
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            console.warn('[updateTrafficStats] 请求成功但返回数据异常');
            return;
          }
          console.log('[updateTrafficStats] 成功获取新数据');
          const trafficData = data.data.cycle_transfer_stats;
          trafficCache = {
            timestamp: now,
            data: trafficData
          };
          renderTrafficStats(trafficData);
        })
        .catch(err => console.error('[updateTrafficStats] 获取失败:', err));
    }

    function startPeriodicRefresh() {
      if (!trafficTimer) {
        console.log('[startPeriodicRefresh] 启动周期刷新任务');
        trafficTimer = setInterval(() => {
          updateTrafficStats();
        }, config.interval);
      }
    }

    function onDomChildListChange() {
      console.log('[onDomChildListChange] 检测到DOM变化, 立即刷新');
      updateTrafficStats();
      if (!trafficTimer) {
        console.log('[onDomChildListChange] 启动定时刷新');
        startPeriodicRefresh();
      }
    }

    const TARGET_SELECTOR = 'section.server-card-list, section.server-inline-list';

    let currentSection = null;
    let childObserver = null;

    function observeSection(section) {
      if (childObserver) {
        childObserver.disconnect();
        console.log('[监听] 断开旧的子节点监听');
      }

      currentSection = section;
      console.log('[监听] 监听新的目标 section 子节点');

      childObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
          if (m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)) {
            console.log('[监听] section 子节点变化，触发刷新');
            onDomChildListChange();
            break;
          }
        }
      });

      childObserver.observe(currentSection, { childList: true, subtree: false });
      updateTrafficStats();
    }

    const sectionDetector = new MutationObserver(() => {
      const section = document.querySelector(TARGET_SELECTOR);
      if (section && section !== currentSection) {
        observeSection(section);
      }
    });

    const root = document.querySelector('main') || document.body;
    sectionDetector.observe(root, { childList: true, subtree: true });
    console.log('[初始化] 启动 sectionDetector, 持续监听 section 切换');

    startPeriodicRefresh();

    window.addEventListener('beforeunload', () => {
      if (trafficTimer) clearInterval(trafficTimer);
      if (childObserver) childObserver.disconnect();
      sectionDetector.disconnect();
      console.log('[清理] 卸载监听器和定时器');
    });
  })();
