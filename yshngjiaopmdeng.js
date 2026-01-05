;(function(){
  const TARGET_TEXTS = ["登录", "管理后台", "服务器总数"];

  const decorate = (a) => {
    // 忽略含 <img> 的 sponsor 链接（避免影响跑马灯中的 logo）
    if (!a || a.querySelector('img')) return;
    if (a.classList.contains('sponsor-badge')) return;
    if (TARGET_TEXTS.includes((a.textContent || '').trim())){
      a.classList.add('sponsor-badge');
    }
  };

  const scan = () => { 
    document.querySelectorAll('a').forEach(decorate); 
  };

  if (document.readyState !== 'loading') scan();
  else document.addEventListener('DOMContentLoaded', scan);

  new MutationObserver(scan).observe(document.documentElement,{subtree:true,childList:true});
})();
