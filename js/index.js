function init() {
    import('./global.burger-menu.js');
    // import('./work-stages.js');
    import('./global-modal-connection.js');

}

const totalPartials = document.querySelectorAll('[hx-trigger="load"], [data-hx-trigger="load"]').length;
let loadedPartialsCount = 0;

document.body.addEventListener('htmx:afterOnLoad', () => {
    loadedPartialsCount++;
    if (loadedPartialsCount === totalPartials) init();
});

function changeProductInModal(direction) {
}