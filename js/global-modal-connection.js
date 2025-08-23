const modal = document.getElementById('modal');
const btn = document.getElementById('callbackBtn');
const closeBtn = document.getElementById('closeModal');
const hourSelect = modal.querySelector('.modal-hour-select');
const minuteSelect = modal.querySelector('.modal-minutes-select');
const daySelect = modal.querySelector('.modal-day-select');
const workDays = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця'];
const workHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const minuteSteps = [0, 10, 20, 30, 40, 50];

function getNextWorkDays() {
    const today = new Date();
    const currentHour = today.getHours();
    let result = [];
    let day = today.getDay(); // 0=Нд, 1=Пн ...

    if (currentHour >= 18) day = (day + 1) % 7;

    while (result.length < 5) {
        if (day >= 1 && day <= 5) result.push(day);
        day = (day + 1) % 7;
    }
    return result;
}

function updateDayOptions() {
    const nextDays = getNextWorkDays();
    daySelect.innerHTML = '';

    nextDays.forEach(dayNum => {
        const option = document.createElement('option');
        option.value = String(dayNum);
        option.text = workDays[dayNum - 1];
        daySelect.appendChild(option);
    });

    daySelect.selectedIndex = 0;
}

function updateTimeOptions() {
    const now = new Date();
    const currentTime = now.getTime();

    hourSelect.innerHTML = '';
    minuteSelect.innerHTML = '';

    const isToday = daySelect.value === 'today';

    if (!isToday) {
        workHours.forEach(h => {
            const opt = document.createElement('option');
            opt.value = opt.text = String(h).padStart(2, '0');
            hourSelect.appendChild(opt);
        });
        minuteSteps.forEach(m => {
            const opt = document.createElement('option');
            opt.value = opt.text = String(m).padStart(2, '0');
            minuteSelect.appendChild(opt);
        });

        if (hourSelect.options.length) hourSelect.selectedIndex = 0;
        if (minuteSelect.options.length) minuteSelect.selectedIndex = 0;

        hourSelect.dispatchEvent(new Event('change', { bubbles: true }));
        minuteSelect.dispatchEvent(new Event('change', { bubbles: true }));
        return;
    }

    const availableHours = [];
    for (const h of workHours) {
        const hasFutureMinute = minuteSteps.some(m => {
            const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
            return candidate.getTime() > currentTime;
        });
        if (hasFutureMinute) availableHours.push(h);
    }

    if (availableHours.length === 0) {
        const tomorrowOpt = Array.from(daySelect.options).find(o => o.value === 'tomorrow');
        if (tomorrowOpt) {
            daySelect.value = 'tomorrow';
            updateTimeOptions();
            return;
        }
    }

    availableHours.forEach(h => {
        const opt = document.createElement('option');
        opt.value = opt.text = String(h).padStart(2, '0');
        hourSelect.appendChild(opt);
    });

    if (hourSelect.options.length) {
        hourSelect.selectedIndex = 0;
        updateMinuteOptionsForHour(Number(hourSelect.value));
    } else {
        minuteSelect.innerHTML = '';
        minuteSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    hourSelect.dispatchEvent(new Event('change', { bubbles: true }));
}

function updateMinuteOptionsForHour(hour) {
    const now = new Date();
    const currentTime = now.getTime();
    const isToday = daySelect.value === 'today';

    minuteSelect.innerHTML = '';

    if (!isToday) {
        minuteSteps.forEach(m => {
            const opt = document.createElement('option');
            opt.value = opt.text = String(m).padStart(2, '0');
            minuteSelect.appendChild(opt);
        });
    } else {
        minuteSteps.forEach(m => {
            const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, m);
            if (candidate.getTime() > currentTime) {
                const opt = document.createElement('option');
                opt.value = opt.text = String(m).padStart(2, '0');
                minuteSelect.appendChild(opt);
            }
        });

        if (minuteSelect.options.length === 0) {
            const nextHourOption = Array.from(hourSelect.options).find(o => Number(o.value) > hour);
            if (nextHourOption) {
                hourSelect.value = nextHourOption.value;
                hourSelect.dispatchEvent(new Event('change', { bubbles: true }));
                updateMinuteOptionsForHour(Number(nextHourOption.value));
                return;
            } else {
                const tomorrowOpt = Array.from(daySelect.options).find(o => o.value === 'tomorrow');
                if (tomorrowOpt) {
                    daySelect.value = 'tomorrow';
                    updateTimeOptions();
                    return;
                }
            }
        }
    }

    if (minuteSelect.options.length) minuteSelect.selectedIndex = 0;

    minuteSelect.dispatchEvent(new Event('change', { bubbles: true }));
}

hourSelect.addEventListener('change', () => {
    const selectedHour = Number(hourSelect.value);
    updateMinuteOptionsForHour(selectedHour);
});

function buildCustomSelect(wrapper) {
    const select = document.querySelector(wrapper.dataset.target);
    if (!select) {
        wrapper.style.display = 'none';
        return;
    }
    wrapper.innerHTML = '';

    const selDiv = document.createElement('div');
    selDiv.className = 'selected';
    const optsDiv = document.createElement('div');
    optsDiv.className = 'custom-options';

    const optsArray = Array.from(select.options);
    if (optsArray.length === 0) {
        selDiv.textContent = '—';
    } else {
        const idx = select.selectedIndex >= 0 ? select.selectedIndex : 0;
        select.selectedIndex = idx;
        selDiv.textContent = select.options[idx].text;
    }

    optsArray.forEach((opt, i) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'custom-option';
        optionEl.textContent = opt.text;
        if (i === select.selectedIndex) optionEl.classList.add('selected');

        optionEl.addEventListener('click', (e) => {
            e.stopPropagation();
            select.value = opt.value;
            select.selectedIndex = i;
            selDiv.textContent = opt.text;
            optsDiv.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
            optionEl.classList.add('selected');
            wrapper.classList.remove('open');
            select.dispatchEvent(new Event('change', { bubbles: true }));
        });

        optsDiv.appendChild(optionEl);
    });

if (!wrapper.__openBound) {
  wrapper.addEventListener('mousedown', (e) => {
    if (e.target.closest('.custom-options')) return;
    e.preventDefault();
    e.stopPropagation();

    document.querySelectorAll('.custom-select.open').forEach(w => {
      if (w !== wrapper) w.classList.remove('open');
    });
    wrapper.classList.toggle('open');
  });
  wrapper.__openBound = true;
}

    wrapper.appendChild(selDiv);
    wrapper.appendChild(optsDiv);

    if (wrapper.dataset.width) wrapper.style.width = wrapper.dataset.width + 'px';
    else wrapper.style.width = (select.offsetWidth || 90) + 'px';
}

function refreshAllCustomSelects() {
    document.querySelectorAll('.custom-select').forEach(buildCustomSelect);
}

daySelect.addEventListener('change', () => {
    updateTimeOptions();
    refreshAllCustomSelects();
});
hourSelect.addEventListener('change', refreshAllCustomSelects);
minuteSelect.addEventListener('change', refreshAllCustomSelects);

btn.addEventListener('click', () => {
    updateDayOptions();
    updateTimeOptions();
    refreshAllCustomSelects();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select').forEach(w => w.classList.remove('open'));
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

refreshAllCustomSelects();