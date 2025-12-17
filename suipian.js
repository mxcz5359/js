document.addEventListener('click', e => {
    createShatterEffect(e.clientX, e.clientY);
});
function createShatterEffect(x, y) {
    const fragmentCount = 20;
    for (let i = 0; i < fragmentCount; i++) {
        const fragment = document.createElement('div');
        fragment.className = 'fragment';
        const angle = Math.random() * 360;
        const distance = Math.random() * 200 + 50;
        const dx = Math.cos(angle * Math.PI / 180) * distance;
        const dy = Math.sin(angle * Math.PI / 180) * distance;

        fragment.style.left = `${x}px`;
        fragment.style.top = `${y}px`;
        fragment.style.setProperty('--dx', `${dx}px`);
        fragment.style.setProperty('--dy', `${dy}px`);
        fragment.style.setProperty('--angle', `${Math.random() * 720}deg`);

        document.body.appendChild(fragment);
        setTimeout(() => fragment.remove(), 1500);
    }
}
