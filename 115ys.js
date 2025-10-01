(function () {
  const REFRESH_INTERVAL = 500;
  const MAX_SPEED = 30 * 1024 * 1024;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes flash-soft {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    @keyframes flash-fast {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.2; }
    }
    .speed-inner {
      padding: 0 3px;
      border-radius: 3px;
      font-weight: bold;
      text-shadow: 0 0 3px #000;
      background-color: rgba(0,0,0,0.3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; /* 强制文字用背景色显示 */
    }
    .speed-boost-1 { animation: flash-soft 1s infinite; }
    .speed-boost-2 { animation: flash-fast 0.7s infinite; transform: scale(1.05); }
    .speed-boost-3 { animation: flash-fast 0.5s infinite; transform: scale(1.15); }
  `;
  document.head.appendChild(style);

  function parseSpeed(speedStr) {
    if (!speedStr) return 0;
    const units = { 'B/s': 1, 'K/s': 1024, 'M/s': 1024 * 1024, 'G/s': 1024 * 1024 * 1024 };
    const regex = /^([\d.]+)([BKMG]\/s)$/;
    const match = speedStr.match(regex);
    if (!match) return 0;
    return parseFloat(match[1]) * (units[match[2]] || 1);
  }

  function speedToGradient(speed, maxSpeed, type) {
    const logSpeed = Math.log10(speed + 1);
    const logMax = Math.log10(maxSpeed + 1);
    const ratio = Math.min(logSpeed / logMax, 1);

    if (type === 'upload') {
      // 白色 → 红色
      return `linear-gradient(to right, white, rgba(255,0,0,${ratio}))`;
    } else {
      // 白色 → 蓝色
      return `linear-gradient(to right, white, rgba(0,0,255,${ratio}))`;
    }
  }

  function applyEffect(elem, speed, type) {
    elem.classList.remove('speed-boost-1', 'speed-boost-2', 'speed-boost-3');
    if (speed > 30 * 1024 * 1024) {
      elem.classList.add('speed-boost-3');
    } else if (speed > 20 * 1024 * 1024) {
      elem.classList.add('speed-boost-2');
    } else if (speed > 10 * 1024 * 1024) {
      elem.classList.add('speed-boost-1');
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

        const uploadStr = uploadElem.textContent.trim();
        const downloadStr = downloadElem.textContent.trim();

        const uploadSpeed = parseSpeed(uploadStr);
        const downloadSpeed = parseSpeed(downloadStr);

        if (!uploadElem.querySelector("span.speed-inner")) {
          uploadElem.innerHTML = `<span class="speed-inner">${uploadStr}</span>`;
        }
        if (!downloadElem.querySelector("span.speed-inner")) {
          downloadElem.innerHTML = `<span class="speed-inner">${downloadStr}</span>`;
        }

        const uploadSpan = uploadElem.querySelector("span.speed-inner");
        const downloadSpan = downloadElem.querySelector("span.speed-inner");

        // 用背景渐变代替 color
        uploadSpan.style.backgroundImage = speedToGradient(uploadSpeed, MAX_SPEED, "upload");
        downloadSpan.style.backgroundImage = speedToGradient(downloadSpeed, MAX_SPEED, "download");

        uploadSpan.style.transition = 'all 0.5s ease';
        downloadSpan.style.transition = 'all 0.5s ease';

        applyEffect(uploadSpan, uploadSpeed, 'upload');
        applyEffect(downloadSpan, downloadSpeed, 'download');
      }
    });
  }

  setInterval(() => {
    if (!document.hidden) updateSpeedColors();
  }, REFRESH_INTERVAL);
})();
