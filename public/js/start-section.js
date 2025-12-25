document.addEventListener('DOMContentLoaded', loadStartSection);
document.body.addEventListener('htmx:afterSwap', (evt) => {
    if (evt.target.querySelector('#start-section__container')) loadStartSection();
});

async function loadStartSection() {
    const container = document.getElementById('start-section__container');
    if (!container) return;

    container.classList.add('start-section__banner');

    try {
        const res = await fetch('/api/start-section');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const items = await res.json();

        container.innerHTML = items.map(item => `
      <div class="start-section__banner-item">
        <div class="start-section__banner-item-icon">
          <img class="${item.imageClass}" src="${item.image}" alt="${item.alt}">
        </div>
        <div class="start-section__banner-item-content">
          <div class="start-section__banner-item-title">
            <p class="start-section__banner-item-title-text">${item.title}</p>
          </div>
          ${item.texts.map(t => `
            <div class="start-section__banner-item-text">
              <p class="start-section__banner-item-text-text ${t.class || ''}">${t.content}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    } catch (err) {
        console.error('Помилка завантаження старт-секції:', err);
    }
}