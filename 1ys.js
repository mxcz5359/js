(function () {
  const REFRESH_INTERVAL = 500; // 刷新间隔
  const MAX_SPEED = 30 * 1024 * 1024; // 30MB/s 阈值

  // 插入速度特效的 CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flash-soft {0%,100%{opacity:1;}50%{opacity:0.6;}}
    @keyframes flash-fast {0%,100%{opacity:1;}50%{opacity:0.2;}}

    .speed-boost-1 {font-weight:bold;animation:flash-soft 1s infinite;
      text-shadow:0 0 4px rgba(255,0,0,0.5);}
    .speed-boost-2 {font-weight:bold;animation:flash-fast 0.7s infinite;
      text-shadow:0 0 6px rgba(255,0,0,0.8);transform:scale(1.05);}
    .speed-boost-3 {font-weight:bold;animation:flash-fast 0.5s infinite;
      text-shadow:0 0 10px rgba(255,0,0,1);transform:scale(1.15);
      background-color:rgba(255,0,0,0.08);border-radius:4px;}

    .speed-boost-1-dl {font-weight:bold;animation:flash-soft 1s infinite;
      text-shadow:0 0 4px rgba(0,0,255,0.5);}
    .speed-boost-2-dl {font-weight:bold;animation:flash-fast 0.7s infinite;
      text-shadow:0 0 6px rgba(0,0,255,0.8);transform:scale(1.05);}
    .speed-boost-3-dl {font-weight:bold;animation:flash-fast 0.5s infinite;
      text-shadow:0 0 10px rgba(0,0,255,1);transform:scale(1.15);
      background-color:rgba(0,0,255,0.08);border-radius:4px;}
  `;
  document.head.appendChild(style);

  // === 速率处理函数 ===
  function parseSpeed(speedStr) {
    if (!speedStr) return 0;
    const units = {'B/s':1,'K/s':1024,'M/s':1024*1024,'G/s':1024*1024*1024};
    const match = speedStr.match(/^([\d.]+)([BKMG]\/s)$/);
    if (!match) return 0;
    return parseFloat(match[1]) * (units[match[2]] || 1);
  }

  function speedToColor(speed, maxSpeed, type) {
    const logSpeed = Math.log10(speed + 1);
    const logMax = Math.log10(maxSpeed + 1);
    const ratio = Math.min(logSpeed / logMax, 1);
    if (type === 'upload') {
      return `rgb(255,${Math.round(255*(1-ratio))},${Math.round(255*(1-ratio))})`;
    } else {
      return `rgb(${Math.round(255*(1-ratio))},${Math.round(255*(1-ratio))},255)`;
    }
  }

  function applyEffect(elem, speed, type) {
    elem.classList.remove(
      'speed-boost-1','speed-boost-2','speed-boost-3',
      'speed-boost-1-dl','speed-boost-2-dl','speed-boost-3-dl'
    );
    if (speed > 30*1024*1024) {
      elem.classList.add(type==='upload'?'speed-boost-3':'speed-boost-3-dl');
    } else if (speed > 20*1024*1024) {
      elem.classList.add(type==='upload'?'speed-boost-2':'speed-boost-2-dl');
    } else if (speed > 10*1024*1024) {
      elem.classList.add(type==='upload'?'speed-boost-1':'speed-boost-1-dl');
    }
  }

  function updateSpeedColors() {
    const cards = document.querySelectorAll('div.rounded-lg.border.bg-card.text-card-foreground.shadow-lg');
    cards.forEach(card => {
      const speedElems = card.querySelectorAll(
        'section.grid.grid-cols-5 > div.flex.flex-col > div.flex.items-center.text-xs.font-semibold'
      );
      if (speedElems.length >= 5) {
        const uploadElem = speedElems[3];
        const downloadElem = speedElems[4];
        const uploadSpeed = parseSpeed(uploadElem.textContent.trim());
        const downloadSpeed = parseSpeed(downloadElem.textContent.trim());
        uploadElem.style.transition = 'color 0.5s ease, transform 0.5s ease';
        downloadElem.style.transition = 'color 0.5s ease, transform 0.5s ease';
        uploadElem.style.setProperty("color", speedToColor(uploadSpeed, MAX_SPEED, 'upload'), "important");
        downloadElem.style.setProperty("color", speedToColor(downloadSpeed, MAX_SPEED, 'download'), "important");
        applyEffect(uploadElem, uploadSpeed, 'upload');
        applyEffect(downloadElem, downloadSpeed, 'download');
      }
    });
  }

  setInterval(() => {
    if (!document.hidden) updateSpeedColors();
  }, REFRESH_INTERVAL);

  // === 名字彩虹渐变 & 离线闪烁 ===
  function getNameElements() {
    return document.querySelectorAll('p.break-normal.font-bold.tracking-tight.text-xs');
  }

  const initialHueOffset = Math.random();
  function getCurrentRainbowColor() {
    const now = new Date();
    const cycle = 300000;
    const t = now.getTime() % cycle;
    const progress = (t / cycle + initialHueOffset) % 1;
    const hue = 30 + progress * 300;
    return `hsl(${hue.toFixed(0)}, 80%, 60%)`;
  }

  function isOffline(el) {
    const statusDot = el.closest("section")?.querySelector('span.h-2.w-2');
    return statusDot?.classList.contains('bg-red-500');
  }

  let offlineElements = new Set();
  let progress = 0;
  let direction = 1;

  function applyColorToNames() {
    offlineElements.clear();
    getNameElements().forEach(el => {
      if (isOffline(el)) {
        offlineElements.add(el);
        el.style.setProperty("color","rgba(255,0,0,0.6)","important");
        el.dataset.colorized = "offline";
      } else {
        el.style.setProperty("color", getCurrentRainbowColor(), "important");
        el.dataset.colorized = "online";
      }
    });
  }

  // 离线闪烁
  setInterval(() => {
    progress += direction*0.05;
    if (progress>=1){progress=1;direction=-1;}
    else if (progress<=0){progress=0;direction=1;}
    const alpha = 0.4+progress*0.4;
    offlineElements.forEach(el => {
      el.style.setProperty("color",`rgba(255,0,0,${alpha.toFixed(2)})`,"important");
    });
  },100);

  // 在线彩虹渐变
  setInterval(() => {
    getNameElements().forEach(el => {
      if (el.dataset.colorized==="online") {
        el.style.setProperty("color", getCurrentRainbowColor(), "important");
      }
    });
  },1000);

  applyColorToNames();
  const observer = new MutationObserver(applyColorToNames);
  observer.observe(document.body,{childList:true,subtree:true});

  function msToNextHour(){
    const now=new Date();
    return (60-now.getMinutes())*60*1000 - now.getSeconds()*1000 - now.getMilliseconds();
  }
  setTimeout(function tick(){
    applyColorToNames();
    setTimeout(tick,60*60*1000);
  },msToNextHour());
})();
