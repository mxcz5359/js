if (window.innerWidth > 768) {
  const div = document.createElement('div');
  div.className = 'wiiuii_layout';
  div.innerHTML = `
    <svg class="editorial" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
         viewBox="0 24 150 28" preserveAspectRatio="none">
      <defs>
        <path id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"/>
      </defs>
      <g class="parallax">
        <use xlink:href="#gentle-wave" x="50" y="0"  fill="rgba(255,255,255,0.8)"/>
        <use xlink:href="#gentle-wave" x="50" y="4"  fill="rgba(255,255,255,0.6)"/>
        <use xlink:href="#gentle-wave" x="50" y="8"  fill="rgba(255,255,255,0.4)"/>
        <use xlink:href="#gentle-wave" x="50" y="12" fill="rgba(255,255,255,0.3)"/>
        <use xlink:href="#gentle-wave" x="50" y="16" fill="rgba(255,255,255,0.2)"/>
        <use xlink:href="#gentle-wave" x="50" y="20" fill="rgba(255,255,255,0.1)"/>
      </g>
    </svg>
  `;
  document.body.appendChild(div);
}
