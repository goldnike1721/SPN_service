document.body.addEventListener('htmx:afterSwap', (evt) => {
    if (evt.target.querySelector('#blocks-container')) {
        loadRealEstate();
    }
});

async function loadRealEstate() {
    try {
        const res = await fetch('/api/real-estate');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const blocks = await res.json();

        const container = document.getElementById('real-estate__container');
        if (!container) return;

        container.innerHTML = `
        <div class="services-section__real-estate">
            <div class="services-section__estate-title">
                <p class="services-section__estate-title-text">Оберіть обʼєкт нерухомості</p>
            </div>
            <div class="services-section__estate-checkbox">
                ${blocks.map(block => `
                    <div id="${block.id}" class="services-section__estate-checkbox-box" data-radio>
                        <div class="services-section__estate-checkbox-box-element"></div>
                        <div class="services-section__estate-checkbox-name">
                            <p class="services-section__estate-checkbox-name-text">${block.label}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    } catch (err) {
        console.error('Помилка завантаження блоків:', err);
    }
}
