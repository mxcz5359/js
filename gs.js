  setInterval(() => {
    fetch('https://v1.jinrishici.com/all.txt')
      .then(response => response.text())
      .then(data => {
        document.title = data; // 每 5 秒更新标题
      })
      .catch(error => console.error('Error fetching poem:', error));
  }, 5000);
['radix-:r0:', 'radix-:r2:'].forEach(id => {
  const btn = document.querySelector(`button#${id.replace(/:/g, '\\:')}`);
  if (btn) btn.remove();
});
document.documentElement.classList.add('dark');
