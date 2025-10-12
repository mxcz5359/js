// 禁用右键菜单
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// 禁用常见调试快捷键
document.addEventListener('keydown', function (e) {
    // F12
    if (e.keyCode === 123) {
        e.preventDefault();
    }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
    }
    // Ctrl+U
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
    }
});

// 定时检测控制台是否被打开
setInterval(function () {
    if (window.outerHeight - window.innerHeight > 200 ||
        window.outerWidth - window.innerWidth > 200) {
        alert("检测到开发者工具已打开！");
        window.location.href = "about:blank"; // 跳转到空白页
    }
}, 1000);
