
  // 确保DOM完全加载后执行
  document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 1. 显示运行时间 =====
    function updateRunTime() {
      const startDate = new Date("2020-05-01T10:00:00"); // 修改为你的建站时间
      const now = new Date();
      const diff = now - startDate;
      
      // 计算时间差
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // 显示结果
      document.getElementById('span_dt_dt').innerHTML = 
        `${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`;
      
      // 每秒更新一次
      setTimeout(updateRunTime, 1000);
    }
    
    // ===== 2. 显示当前日期 =====
    function updateDate() {
      const date = new Date();
      const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
      document.getElementById('date').textContent = 
        `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
    }
    
    // ===== 3. 获取系统信息 =====
    function getOS() {
      const ua = navigator.userAgent;
      if (/Windows NT 10|Windows NT 11/.test(ua)) return 'Windows 10/11';
      if (/Mac OS X/.test(ua)) return 'Mac OS';
      if (/Android/.test(ua)) return 'Android';
      if (/iPhone/.test(ua)) return 'iPhone';
      if (/Linux/.test(ua)) return 'Linux';
      return '未知';
    }
    
    function getBrowser() {
      const ua = navigator.userAgent;
      const chromeMatch = ua.match(/Chrome\/([\d.]+)/);
      if (chromeMatch) return `Chrome (${chromeMatch[1]})`;
      if (/Firefox/.test(ua)) return 'Firefox';
      if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
      return '未知';
    }
    
    // ===== 4. IP回调处理 =====
    window.callback = function(ip, location) {
      document.getElementById('ip').textContent = ip || '未知';
      document.getElementById('location').textContent = location ? 
        location.split(/[—-]/)[0].trim() : '未知地区';
    };
    
    // ===== 初始化 =====
    updateDate();
    updateRunTime();
    document.getElementById('os').textContent = getOS();
    document.getElementById('browser').textContent = getBrowser();
    
    // IP获取超时处理
    setTimeout(() => {
      if (document.getElementById('ip').textContent === '获取中...') {
        document.getElementById('ip').textContent = '获取失败';
        document.getElementById('location').textContent = '未知地区';
      }
    }, 10000);
  });
  </script>
