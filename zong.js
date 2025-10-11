window.FixedTopServerName = true;
window.CustomBackgroundImage="https://img.050002.xyz/"; /* 页面背景图 */
window.CustomLogo = "https://mxcz.useruno.com/mxcz5359/2025073068898fa1e0c2e.png"; /* 自定义Logo */
window.ShowNetTransfer  = "true"; /* 卡片显示上下行流量 */
/*window.DisableAnimatedMan  = "true";*/     /* 关掉动画人物插图 */
window.CustomIllustration = 'https://cdn.jsdelivr.net/gh/mxcz5359/js@main/nz1.png';
window.CustomDesc ="MyVps"; /* 自定义描述 */
window.ForcePeakCutEnabled = true;
window.ForceUseSvgFlag = true;
window.ForceTheme = 'dark'; /* 强制主题色, 可选值为 light 或 dark */
window.CustomLinks = '[{"link":"https://mxcz.uk/","name":"Mybox"},{"link":"https://test.mye.ee/index.html","name":"Test"},{"link":"https://ai.mye.ee/","name":"Ai"}]';
// 自定义字体：LXGW WenKai
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/style.css';
document.head.appendChild(link);
// 新增的图片观察器
var imgObserver = new MutationObserver(function(mutationsList, observer) {
  var xpath = "/html/body/div/div/main/div[2]/section[1]/div[4]/div";
  var container = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  if (container) {
    observer.disconnect();
    var existingImg = container.querySelector("img");
    if (existingImg) {
      container.removeChild(existingImg);
    }
    var imgElement = document.createElement("img");
    imgElement.src = "https://mxcz.useruno.com/mxcz5359/202507306889ac02d87b7.webp";
    imgElement.style.position = "absolute";
    imgElement.style.right = "-20px";
    imgElement.style.top = "-70px";
    imgElement.style.zIndex = "10";
    imgElement.style.width = "100px";  // ⭐️ 这里直接控制卡通人物宽度（高度会自动等比缩放）
    container.appendChild(imgElement);
  }
});

// 启动图片观察器
imgObserver.observe(document.body, {
  childList: true,
  subtree: true
});
setInterval(() => {
    fetch('https://v1.jinrishici.com/all.txt')
      .then(response => response.text())
      .then(data => {
        document.title = data; // 每 5 秒更新标题
      })
      .catch(error => console.error('Error fetching poem:', error));
  }, 5000);
