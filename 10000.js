<script>
    // 工具函数：根据时间自动设置主题
    function autoSetTheme() {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;
      
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme(isNight ? 'night' : 'day');
      }
    }

    // 设置主题
    function setTheme(theme) {
      const body = document.body;
      const headerEmoji = document.getElementById('header-emoji');
      
      if (theme === 'night') {
        body.className = 'night-mode';
        headerEmoji.textContent = '🌙';
      } else {
        body.className = 'day-mode';
        headerEmoji.textContent = '🌞';
      }
      
      localStorage.setItem('theme', theme);
    }

    // 切换主题
    function toggleTheme() {
      const isNight = document.body.classList.contains('night-mode');
      setTheme(isNight ? 'day' : 'night');
    }

    // 显示日期
    function displayDate() {
      const d = new Date();
      const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
      document.getElementById('date').textContent = 
        `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`;
    }

    // 获取操作系统
    function getOS() {
      const ua = navigator.userAgent;
      if (ua.includes('Windows NT 10') || ua.includes('Windows NT 11')) return 'Windows 10/11';
      if (ua.includes('Mac OS X')) return 'Mac OS';
      if (ua.includes('Android')) return 'Android';
      if (ua.includes('iPhone')) return 'iPhone';
      if (ua.includes('Linux')) return 'Linux';
      return '未知';
    }

    // 获取浏览器
    function getBrowser() {
      const ua = navigator.userAgent;
      if (ua.includes('Chrome')) return `Chrome (${(ua.match(/Chrome\/([0-9.]+)/)?.[1] || '')})`;
      if (ua.includes('Firefox')) return 'Firefox';
      if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
      return '未知';
    }

    // 设置IP信息
    function setIpInfo(ip, location) {
      document.getElementById('ip').textContent = ip || '获取失败';
      
      let shortLocation = '未知地区';
      if (location) {
        shortLocation = location.split(/[—-]/)[0].trim();
        const parts = shortLocation.split(/[,，、\s]+/)
                          .map(p => p.trim())
                          .filter(p => p);
        
        const uniqueParts = parts.filter((p, i) => i === 0 || p !== parts[i - 1]);
        shortLocation = uniqueParts.slice(0, 3).join(' ');
      }
      
      document.getElementById('location').textContent = shortLocation;
    }

    // 设置IP错误
    function setIpError() {
      document.getElementById('ip').textContent = '获取失败';
      document.getElementById('location').textContent = '未知地区';
    }

    // JSONP回调
    window.callback = function(ip, location) {
      setIpInfo(ip, location);
    };

    // 初始化
    autoSetTheme();
    displayDate();
    document.getElementById('os').textContent = getOS();
    document.getElementById('browser').textContent = getBrowser();

    // 超时处理
    setTimeout(() => {
      if (document.getElementById('ip').textContent === '获取中...') {
        setIpError();
      }
    }, 10000);

    // 每小时自动检查并更新主题
    setInterval(autoSetTheme, 3600000);
  </script>
