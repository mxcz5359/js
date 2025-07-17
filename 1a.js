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

// 使用ping0免费API通过JSONP方式获取IP和归属地
function setIpInfo(ip, location) {
  document.getElementById('ip').innerText = ip || '获取失败';
  
  // 精简位置信息
  let shortLocation = '未知地区';
  if(location) {
    // 1. 删除破折号及后面的所有内容
    shortLocation = location.split(/[—-]/)[0].trim();
    
    // 2. 分割并处理各部分
    const parts = shortLocation.split(/[,，、\s]+/) // 支持多种分隔符
                      .map(part => part.trim())
                      .filter(part => part !== '');
    
    // 3. 去除连续重复的地区名
    const uniqueParts = [];
    for (let i = 0; i < parts.length; i++) {
      if (i === 0 || parts[i] !== parts[i-1]) {
        uniqueParts.push(parts[i]);
      }
    }
    
    // 4. 组合最终结果（最多保留前三部分）
    if (uniqueParts.length >= 3) {
      shortLocation = `${uniqueParts[0]} ${uniqueParts[1]} ${uniqueParts[2]}`;
    } else if (uniqueParts.length >= 2) {
      shortLocation = `${uniqueParts[0]} ${uniqueParts[1]}`;
    } else if (uniqueParts.length === 1) {
      shortLocation = uniqueParts[0];
    }
  }
  
  document.getElementById('location').innerText = shortLocation;
}

function setIpError() {
  document.getElementById('ip').innerText = '获取失败';
  document.getElementById('location').innerText = '未知地区';
}

window.callback = function(ip, location){
  setIpInfo(ip, location);
};

// 超时兜底：10秒后如果IP还未显示则兜底
setTimeout(function(){
  if(document.getElementById('ip').innerText === '获取中...'){
    setIpError();
  }
}, 10000);
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
