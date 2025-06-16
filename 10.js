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
  
  // 精简位置信息，处理重复地区名
  let shortLocation = '未知地区';
  if(location) {
    // 1. 去除所有破折号和云服务商信息
    shortLocation = location.replace(/—/g, '')
                          .replace(/AWS|亚马逊云|阿里云|搬瓦工|腾讯云|Google Cloud|Microsoft Azure/gi, '')
                          .trim();
    
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
    
    // 4. 组合最终结果（最多保留前两部分）
    if (uniqueParts.length >= 2) {
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
