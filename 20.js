<script>
  // 禁用默认小人图（哪吒官方保留变量）
  window.DisableAnimatedMan = true;

  // 安全引入自定义字体（防止重复声明）
  if (!window.fontLink) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://font.sec.miui.com/font/css?family=MiSans:400,700:MiSans';
    document.head.appendChild(fontLink);
    window.fontLink = fontLink;
  }

  // 修改左上角标题文本 "哪吒监控" -> "哪吒探针"
  const observerAdminTitle = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          const links = node.matches('.transition-opacity') ? [node] : node.querySelectorAll('.transition-opacity');
          links.forEach(link => {
            const textNode = Array.from(link.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '哪吒监控');
            if (textNode) {
              textNode.textContent = '哪吒探针';
              observerAdminTitle.disconnect();
            }
          });
        }
      });
    });
  });
  observerAdminTitle.observe(document.body, { childList: true, subtree: true });

  // 提前定义 live2d_path（防止 loads.js 报错）
  if (!window.live2d_path) {
    window.live2d_path = "/live2d/";
  }
</script>
