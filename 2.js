window.CustomBackgroundImage="https://php.535359.xyz/"; /* 页面背景图 */
window.CustomLogo = "https://img.535359.xyz/i/2025/07/05/9984209a3bdfe6f8001.jpg"; /* 自定义Logo */
window.ShowNetTransfer  = "true"; /* 卡片显示上下行流量 */
/*window.DisableAnimatedMan  = "true";*/     /* 关掉动画人物插图 */
window.CustomIllustration = 'https://img.535359.xyz/i/2025/07/05/126aa6d917803f8d001.webp';
window.CustomDesc ="MyVps"; /* 自定义描述 */
window.CustomLinks = '[{"link":"https://mybox.535359.xyz/","name":"Mybox"},{"link":"https://ai.535359.xyz:5359/","name":"Ai"}]';

// 自定义字体：LXGW WenKai
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/style.css';
document.head.appendChild(link);

const selectorButton = '#root > div > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > section > div.flex.justify-center.w-full.max-w-\\[200px\\] > div > div > div.relative.cursor-pointer.rounded-3xl.px-2\\.5.py-\\[8px\\].text-\\[13px\\].font-\\[600\\].transition-all.duration-500.text-stone-400.dark\\:text-stone-500';
const selectorSection = '#root > div > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > section';
const selector3 = '#root > div > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > div:nth-child(3)';
const selector4 = '#root > div > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > div:nth-child(4)';

let hasClicked = false;
let divVisible = false;
let swapping = false;

function forceBothVisible() {
  const div3 = document.querySelector(selector3);
  const div4 = document.querySelector(selector4);
  if (div3 && div4) {
    div3.style.display = 'block';
    div4.style.display = 'block';
  }
}

function hideSection() {
  const section = document.querySelector(selectorSection);
  if (section) {
    section.style.display = 'none';
  }
}

function tryClickButton() {
  const btn = document.querySelector(selectorButton);
  if (btn && !hasClicked) {
    btn.click();
    hasClicked = true;
    setTimeout(forceBothVisible, 500);
  }
}

function swapDiv3AndDiv4() {
  if (swapping) return;
  swapping = true;

  const div3 = document.querySelector(selector3);
  const div4 = document.querySelector(selector4);
  if (!div3 || !div4) {
    swapping = false;
    return;
  }
  const parent = div3.parentNode;
  if (parent !== div4.parentNode) {
    swapping = false;
    return;
  }

  // 交换 div3 和 div4 的位置
  parent.insertBefore(div4, div3);
  parent.insertBefore(div3, div4.nextSibling);

  swapping = false;
}

const observer = new MutationObserver(() => {
  const div3 = document.querySelector(selector3);
  const div4 = document.querySelector(selector4);

  const isDiv3Visible = div3 && getComputedStyle(div3).display !== 'none';
  const isDiv4Visible = div4 && getComputedStyle(div4).display !== 'none';

  const isAnyDivVisible = isDiv3Visible || isDiv4Visible;

  if (isAnyDivVisible && !divVisible) {
    hideSection();
    tryClickButton();
    setTimeout(swapDiv3AndDiv4, 100); 
  } else if (!isAnyDivVisible && divVisible) {
    hasClicked = false;
  }

  divVisible = isAnyDivVisible;

  if (div3 && div4) {
    if (!isDiv3Visible || !isDiv4Visible) {
      forceBothVisible();
    }
  }
});

const root = document.querySelector('#root');
if (root) {
  observer.observe(root, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ['style', 'class']
  });
}

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
    imgElement.src = "https://img.535359.xyz/i/2025/07/05/126aa6d917803f8d001.webp";
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
