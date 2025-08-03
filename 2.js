  window.TrafficScriptConfig = {
    showTrafficStats: true,    
    insertAfter: true,         
    interval: 60000,          
    toggleInterval: 5000,      
    duration: 500,             
    enableLog: false           
  };

// 自定义字体：LXGW WenKai
var link = document.createElement('link');
link。rel = 'stylesheet';
link。href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/style.css';
document。head.appendChild(link);

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
