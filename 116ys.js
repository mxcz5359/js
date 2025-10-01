(function () {
  const REFRESH_INTERVAL = 500;
  const MAX_SPEED = 30 * 1024 * 1024;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes flash-soft { 0%,100%{opacity:1;}50%{opacity:0.6;} }
    @keyframes flash-fast { 0%,100%{opacity:1;}50%{opacity:0.2;} }

    .speed-colored {
      font-weight: bold;
      text-shadow: 0 0 3px #000, 0 0 6px #000;
      position: relative;
      z-index: 9999; /* 确保在背景图之上 */
    }
    .speed-boost-1 { animation: flash-soft 1s infinite; }
    .speed-boost-2 { animation: flash-fast 0.7s infinite; transform: scale(1.05); }
    .speed-boost-3 { animation: flash-fast 0.5s infinite; transform: scale(1.15); }
  `;
  document.head.appendChild(style);

  function parseSpeed(speedStr) {
    if (!speedStr) return 0;
    const units = { "B/s": 1, "K/s": 1024, "M/s": 1024*1024, "G/s": 1024*1024*1024 };
    const match = speedStr.match(/^([\d.]+)([BKMG]\/s)$/);
    if (!match) return 0;
    return parseFloat(match[1]) * (units[match[2]] || 1);
  }

  function speedToColor(speed, maxSpeed, type) {
    const logSpeed = Math.log10(speed + 1);
    const logMax = Math.log10(maxSpeed + 1);
    const ratio = Math.min(logSpeed / logMax, 1);

    if (type === "upload") {
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

  function applyEffect(elem, speed) {
    elem.classList.remove("speed-boost-1","speed-boost-2","speed-boost-3");
    if (speed > 30 * 1024 * 1024) {
      elem.classList.add("speed-boost-3");
    } else if (speed > 20 * 1024 * 1024) {
      elem.classList.add("speed-boost-2");
    } else if (speed > 10 * 1024 * 1024) {
      elem.classList.add("speed-boost-1");
    }
  }

  function updateSpeedColors() {
    const cards = document.querySelectorAll("div.rounded-lg.border.bg-card.text-card-foreground.shadow-lg");
    cards.forEach(card => {
      const speedElems = card.querySelectorAll(
        "section.grid.grid-cols-5 > div.flex.flex-col > div.flex.items-center.text-xs.font-semibold"
      );
      if (speedElems.length >= 5) {
        const [uploadElem, downloadElem] = [speedElems[3], speedElems[4]];
        const [uploadStr, downloadStr] = [uploadElem.textContent.trim(), downloadElem.textContent.trim()];

        const [uploadSpeed, downloadSpeed] = [parseSpeed(uploadStr), parseSpeed(downloadStr)];

        // 包一层 span，完全独立
        function wrap(elem, text) {
          if (!elem.querySelector(".speed-colored")) {
            elem.innerHTML = `<span class="speed-colored">${text}</span>`;
          } else {
            elem.querySelector(".speed-colored").textContent = text;
          }
          return elem.querySelector(".speed-colored");
        }

        const uploadSpan = wrap(uploadElem, uploadStr);
        const downloadSpan = wrap(downloadElem, downloadStr);

        uploadSpan.style.color = speedToColor(uploadSpeed, MAX_SPEED, "upload");
        downloadSpan.style.color = speedToColor(downloadSpeed, MAX_SPEED, "download");

        applyEffect(uploadSpan, uploadSpeed);
        applyEffect(downloadSpan, downloadSpeed);
      }
    });
  }

  setInterval(() => {
    if (!document.hidden) updateSpeedColors();
  }, REFRESH_INTERVAL);
})();
