    // 1. IP获取与慢速显示逻辑
    const bar = document.getElementById('capsule-bar');
    const el = document.getElementById('ip-display');

    fetch('https://ipwho.is/?lang=zh-CN')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // 填入数据
                el.innerHTML = `
                    <span class="ip-prefix">Your IP:</span> 
                    ${data.ip} 
                    <span class="capsule-divider"></span> 
                    <span>${data.city}</span>
                    <span class="isp-info">&nbsp;${data.connection.isp}</span>
                `;
                
                // 关键修改 1：数据就绪后，先等待 1.5 秒 (不要立即出现)
                setTimeout(() => {
                    // 关键修改 2：添加类名，触发 CSS 中定义的 2.5秒 慢速淡入
                    bar.classList.add('active');
                    
                    // 关键修改 3：显示 10 秒后自动消失 (从动画开始算起，实际停留时间会包含动画时间)
                    setTimeout(() => {
                        bar.classList.remove('active');
                    }, 10000); 
                    
                }, 1500); // <-- 这里是启动延迟 1.5s

            } else {
                el.innerText = "Network Info N/A";
            }
        })
        .catch(() => { console.log("Fetch error"); });

    // 2. 滚动监听 (返回顶部按钮 - 保持灵敏)
    const btn = document.getElementById('back-top-btn');
    window.addEventListener('scroll', function(e) {
        const scrollTop = window.scrollY || e.target.scrollTop || document.documentElement.scrollTop || 0;
        if (scrollTop > 200) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, true);

    // 3. 返回顶部
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const scrollables = document.querySelectorAll('div, main');
        scrollables.forEach(el => {
            if (el.scrollTop > 0) try { el.scrollTo({ top: 0, behavior: 'smooth' }); } catch(e){}
        });
    }
