document.addEventListener('DOMContentLoaded', loadWorkStages);
document.body.addEventListener('htmx:afterSwap', (evt) => {
  if (evt.target.querySelector('#work-stages__container')) loadWorkStages();
});

async function loadWorkStages() {
  const container = document.getElementById('work-stages__container');
  if (!container) return;

  try {
    const res = await fetch('/api/work-stages');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const stages = await res.json();

    const html = stages.map(stage => `
      <div class="work-stages-section__work">
        <div class="work-stages-section__work-circle">
          <div class="work-stages-section__work-name">
            <img src="${stage.image}" alt="${stage.step}" class="work-stages-section__work-image">
          </div>
          <div class="work-stages-section__work-description">
            <p class="work-stages-section__work-description-text">${stage.description}</p>
          </div>
        </div>
      </div>
      <div class="work-stages-section__work-description-general ${stage.descGeneralClass || ''}">
        <div class="work-stages-section__work-arrow ${stage.arrowClass}">
          <img class="work-stages-section__work-arrow-image"
               src="img/work-stages/line_end_arrow.png"
               alt="Іконка стрілки">
        </div>
        <div class="work-stages-section__work-description">
          <p class="work-stages-section__work-description-text work-description-text__none">
            ${stage.description}
          </p>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;

  } catch (err) {
    console.error('Помилка завантаження work-stages:', err);
  }
}
