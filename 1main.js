// ===== 显示网站运行时间 =====
function showRunTime() {
  const BirthDay = new Date("2020-05-01T10:00:01"); // 修改为你的建站时间
  const today = new Date();
  const timeDiff = today - BirthDay;
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  document.getElementById('span_dt_dt').innerHTML = 
    `<span class="highlight">${days}</span> 天 ` +
    `<span class="highlight">${hours}</span> 时 ` +
    `<span class="highlight">${mins}</span> 分 ` +
    `<span class="highlight">${secs}</span> 秒`;
  
  setTimeout(showRunTime, 1000); // 每秒更新
}

// 在页面加载后启动
document.addEventListener('DOMContentLoaded', showRunTime);
