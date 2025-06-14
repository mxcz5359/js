 <style>
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background: #f6fafd;
      font-family: 'Segoe UI', '微软雅黑', Arial, sans-serif;
    }
    .container {
      max-width: 720px;
      min-height: 450px;
      margin: 40px auto;
      background: url('https://t.alcy.cc/bd') center center/cover no-repeat;
      border-radius: 18px;
      box-shadow: 0 5px 24px 0 rgba(74,120,255,0.08), 0 2px 8px rgba(0,0,0,0.04);
      padding: 38px 28px 32px 28px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background-clip: padding-box;
    }
    .content-inner {
      min-height: 300px;
    }
    .header,
    .info-list {
      position: relative;
      z-index: 1;
      text-shadow: 0 2px 8px rgba(255,255,255,0.7), 0 0 2px #fff;
    }
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 18px;
    }
    .header .emoji {
      font-size: 2em;
      margin-right: 12px;
    }
    .header .title {
      font-size: 1.5em;
      font-weight: 700;
      color: #3d4e77;
      letter-spacing: 1px;
    }
    .info-list {
      margin: 0;
      padding: 0 0 0 8px;
      list-style: none;
      font-size: 1.12em;
      color: #414a60;
    }
    .info-list li {
      margin: 10px 0;
      display: flex;
      align-items: center;
    }
    .info-list .icon {
      font-size: 1.2em;
      margin-right: 8px;
      color: #6ba4ff;
    }
    .highlight {
      color: #e74c3c;
      font-weight: 600;
      letter-spacing: 1px;
    }
    .counter-block {
      margin-top: 32px;
      text-align: center;
      z-index: 2;
      position: relative;
    }
    @media (max-width: 650px) {
      .container { max-width: 98vw; padding: 12px 2vw 16px 2vw; min-height: 350px;}
      .content-inner { min-height: 220px;}
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content-inner">
      <div class="header">
        <div class="emoji">🌿</div>
        <div class="title">欢迎您来自 <span id="location" class="highlight">定位中...</span> 的朋友！</div>
      </div>
      <ul class="info-list">
        <li><span class="icon">🐳</span> 今天是 <span id="date"></span></li>
        <li><span class="icon">🐾</span> 您的IP是：<span id="ip" class="highlight">获取中...</span></li>
        <li><span class="icon">💦</span> 您使用的是 <span id="os"></span> 操作系统</li>
        <li><span class="icon">🕸️</span> 您使用的是 <span id="browser"></span> 浏览器</li>
      </ul>
    </div>
    <div class="counter-block">
      <img src="https://moe.8845.top/get/?name=MyCounter&theme=capoo-1" alt="网站访问计数器" />
    </div>
  </div>
  <script>
    // 显示日期
    const date = new Date();
    const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    document.getElementById('date').innerText =
      date.getFullYear() + '年' + (date.getMonth()+1) + '月' + date.getDate() + '日 ' + weekdays[date.getDay()];

    // 获取操作系统和浏览器
    function getOS() {
      let ua = navigator.userAgent;
      if (ua.indexOf('Windows NT 10') !== -1 || ua.indexOf('Windows NT 11') !== -1) return 'Windows 10/11';
      if (ua.indexOf('Mac OS X') !== -1) return 'Mac OS';
      if (ua.indexOf('Android') !== -1) return 'Android';
      if (ua.indexOf('iPhone') !== -1) return 'iPhone';
      if (ua.indexOf('Linux') !== -1) return 'Linux';
      return '未知';
    }
    function getBrowser() {
      let ua = navigator.userAgent;
      if (ua.indexOf('Chrome') !== -1) return 'Chrome (' + (ua.match(/Chrome\/([0-9.]+)/)?.[1] || '') + ')';
      if (ua.indexOf('Firefox') !== -1) return 'Firefox';
      if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) return 'Safari';
      return '未知';
    }
    document.getElementById('os').innerText = getOS();
    document.getElementById('browser').innerText = getBrowser();

    // 获取IP和归属地,增加兜底逻辑,保证不会出现空白
fetch('https://api.ip.sb/geoip')
  .then(res => res.json())
  .then(data => {
    let locationText = '';
    if (data.country) locationText += data.country;
    if (data.region) locationText += (locationText ? '·' : '') + data.region;
    if (data.city) locationText += (locationText ? '·' : '') + data.city;
    if (!locationText) locationText = '未知地区';
    document.getElementById('location').innerText = locationText;
    document.getElementById('ip').innerText = data.ip || '获取失败';
  })
  .catch(() => {
    document.getElementById('ip').innerText = '获取失败';
    document.getElementById('location').innerText = '未知地区';
  });
</script>
