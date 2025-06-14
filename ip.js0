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

// 获取IP和归属地
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
