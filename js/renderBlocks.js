document.body.addEventListener('htmx:afterSwap', (evt) => {
    if (evt.target.querySelector('#blocks-container')) {
        loadBlocks();
    }
});

async function loadBlocks() {
    try {
        const res = await fetch('api/blocks.json');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const blocks = await res.json();

        const container = document.getElementById('blocks-container');
        if (!container) return;

        container.innerHTML = blocks.map(createBlockHTML).join('');
    } catch (err) {
        console.error('Помилка завантаження блоків:', err);
    }
}

function createBlockHTML(block) {
    return `
    <div id="${block.id}" class="services-section__final-block-general">
      <div class="${block.wrapperClass}">
        ${block.groups.map((group, i) => `
          <div class="${block.blockClass} ${i === 1 ? 'services-section__final-block-bottom' : ''}">
            <div class="${block.titleClass}">
              <p class="${block.titleClass}-text">${group.title}</p>
            </div>
            <div class="${block.checkboxClass}">
              ${group.options.map(opt => `
                <div class="${block.checkboxBoxClass}" ${opt.dataAttr}>
                  <div class="${block.checkboxElementClass}"></div>
                  <div class="${block.checkboxNameClass}">
                    <p class="${block.checkboxNameClass}-text">${opt.label}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}