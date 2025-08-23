const callbackButton = document.getElementById('callbackButton');
const callbackMenu = document.getElementById('callbackMenu');
const callbackIcon = document.querySelector('.callback-fixed__image');
const callbackMenuClose = document.getElementById('callbackMenuClose');

callbackIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    callbackMenu.style.display = 'flex';
    document.body.classList.add('no-scroll');
});

callbackMenuClose.addEventListener('click', () => {
    callbackMenu.style.display = 'none';
    document.body.classList.remove('no-scroll');
});

callbackMenu.addEventListener('click', (e) => {
    if (e.target === callbackMenu) {
        callbackMenu.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});