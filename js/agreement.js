document.body.addEventListener('htmx:afterSwap', (evt) => {
    if (evt.target.querySelector('#agreement-container')) {
        loadAgreement();
    }
});

async function loadAgreement() {
    try {
        const res = await fetch('api/agreement.json');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const blocks = await res.json();

        const container = document.getElementById('agreement-container');
        if (!container) return;

        container.innerHTML = `
        <div class="services-section__agreement">
            <div class="services-section__agreement-title">
                <p class="services-section__agreement-title-text">Оберіть тип угоди</p>
            </div>
            <div class="services-section__agreement-checkbox">
                ${blocks.map(block => `
                    <div id="${block.id}" class="services-section__agreement-checkbox-box" data-radio-agreement>
                        <div class="services-section__agreement-checkbox-box-element"></div>
                        <div class="services-section__agreement-checkbox-name">
                            <p class="services-section__agreement-checkbox-name-text">${block.label}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    } catch (err) {
        console.error('Помилка завантаження блоку угоди:', err);
    }
}
