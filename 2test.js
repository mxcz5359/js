(function() {
  fetch("https://cdn.jsdelivr.net/gh/mxcz5359/js@main/test.html")
    .then(res => res.text())
    .then(html => {
      const div = document.createElement("div");
      div.id = "aff-container";
      div.innerHTML = html;
      document.body.appendChild(div);
    })
    .catch(err => console.error("加载 aff.html 失败：", err));
})();
