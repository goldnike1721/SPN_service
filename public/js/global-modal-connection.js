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
    const result = [];

    let dayCounter = 0;
    while (result.length < 5) {
        const candidate = new Date(today);
        candidate.setDate(today.getDate() + dayCounter);

        const dayNum = candidate.getDay();
        if (dayNum >= 1 && dayNum <= 5) {
            const dayText = workDays[dayNum - 1];
            const formattedDate = candidate.toLocaleDateString('uk-UA');
            result.push({ dateObj: candidate, value: formattedDate, text: `${dayText}, ${formattedDate}` });
        }
        dayCounter++;
    }

    return result;
}
function updateDayOptions() {
    const nextDays = getNextWorkDays();
    daySelect.innerHTML = '';

    nextDays.forEach(day => {
        const option = document.createElement('option');
        option.value = day.value;
        option.text = day.text.split(',')[0];
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
const phoneInput = document.querySelector('.modal-day-input[type="tel"]');

phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});

document.querySelector('.modal-btn').addEventListener('click', () => {
    const name = document.querySelector('.modal-day-input[type="text"]').value.trim();
    const phone = document.querySelector('.modal-day-input[type="tel"]').value.trim();

    if (!name || !phone) {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = 'Будь ласка, заповніть ім’я та номер телефону!';
        msgDiv.style.position = 'fixed';
        msgDiv.style.top = '40px';
        msgDiv.style.left = '50%';
        msgDiv.style.transform = 'translateX(-50%)';
        msgDiv.style.backgroundColor = '#d32f2f';
        msgDiv.style.color = 'white';
        msgDiv.style.padding = '20px 10px';
        msgDiv.style.borderRadius = '8px';
        msgDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        msgDiv.style.zIndex = 9999;
        msgDiv.style.textAlign = 'center';
        msgDiv.style.fontSize = '16px';
        msgDiv.style.fontWeight = '500';
        msgDiv.style.width = '90%';
        msgDiv.style['max-width'] = '700px';
        document.body.appendChild(msgDiv);

        setTimeout(() => {
            msgDiv.remove();
        }, 2000);

        return;
    }

    const hour = document.querySelector('.modal-hour-select').value;
    const minutes = document.querySelector('.modal-minutes-select').value;
    const dateValue = daySelect.value;
    const dateParts = dateValue.split('.');
    const dateObj = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
    const weekDays = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця', 'Субота'];
    const dayName = weekDays[dateObj.getDay()];

    const callbackTime = `${dayName}, ${dateValue} о ${hour}:${minutes}`;
    const createdAt = new Date().toLocaleString();

    const data = { name, phone, callbackTime, createdAt };

    fetch('/api/send-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => {
            const msgDiv = document.createElement('div');
            msgDiv.textContent = 'Заявка надіслана! Чекайте на дзвінок.';
            msgDiv.style.position = 'fixed';
            msgDiv.style.top = '40px';
            msgDiv.style.left = '50%';
            msgDiv.style.transform = 'translateX(-50%)';
            msgDiv.style.backgroundColor = '#013b46';
            msgDiv.style.color = 'white';
            msgDiv.style.padding = '20px 10px';
            msgDiv.style.borderRadius = '8px';
            msgDiv.style.boxShadow = '0 4px 12px rgba(255,255,255,0.5)';
            msgDiv.style.zIndex = 9999;
            msgDiv.style.textAlign = 'center';
            msgDiv.style.fontSize = '16px';
            msgDiv.style.fontWeight = '500';
            msgDiv.style.width = '90%';
            msgDiv.style['max-width'] = '700px';
            document.body.appendChild(msgDiv);

            setTimeout(() => {
                msgDiv.remove();
                location.reload();
            }, 2000);
        })
        .catch(err => {
            console.error(err);
            alert('Сталася помилка');
        });
});

refreshAllCustomSelects();