const modal = document.getElementById('modal');
const btn = document.getElementById('callbackBtn');
const closeBtn = document.getElementById('closeModal');

const hourSelect = modal.querySelector('.modal-time select:nth-child(1)');
const minuteSelect = modal.querySelector('.modal-time select:nth-child(2)');
const daySelect = modal.querySelector('.modal-time select:nth-child(3)');

const workDays = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця'];
const workHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const minuteSteps = [0, 10, 20, 30, 40, 50];

function getNextWorkDays() {
    const today = new Date();
    const currentHour = today.getHours();
    let result = [];
    let day = today.getDay(); // 0=Нд, 1=Пн ...

    // Якщо зараз вже кінець робочого дня — починаємо з наступного дня
    if (currentHour >= 18) {
        day = (day + 1) % 7;
    }

    while (result.length < 5) {
        if (day >= 1 && day <= 5) {
            result.push(day);
        }
        day = (day + 1) % 7;
    }
    return result;
}

function updateDayOptions() {
    const today = new Date();
    const currentHour = today.getHours();
    const nextDays = getNextWorkDays();
    daySelect.innerHTML = '';

    nextDays.forEach((dayNum, idx) => {
        let option = document.createElement('option');
        // Якщо перший день і це сьогодні
        if (idx === 0 && dayNum === today.getDay()) {
            option.text = 'Сьогодні';
        }
        // Якщо перший день — наступний після сьогодні
        else if ((idx === 0 && dayNum !== today.getDay()) || 
                 (idx === 1 && dayNum === today.getDay())) {
            option.text = 'Завтра';
        }
        else {
            option.text = workDays[dayNum - 1];
        }
        daySelect.appendChild(option);
    });
}


function updateTimeOptions() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    hourSelect.innerHTML = '';
    minuteSelect.innerHTML = '';

    let isToday = daySelect.value === 'Сьогодні';

    if (!isToday) {
        // Завтра чи інший день — повний робочий час
        workHours.forEach(h => {
            let opt = document.createElement('option');
            opt.value = opt.text = String(h).padStart(2, '0');
            hourSelect.appendChild(opt);
        });
        minuteSteps.forEach(m => {
            let opt = document.createElement('option');
            opt.value = opt.text = String(m).padStart(2, '0');
            minuteSelect.appendChild(opt);
        });
    } else {
        // Сьогодні — тільки майбутній час
        let startHour = currentHour;
        let startMinute = minuteSteps.find(m => m > currentMinute);

        if (startMinute === undefined) { 
            startHour++;
            startMinute = 0;
        }

        workHours.forEach(h => {
            if (h >= startHour) {
                let opt = document.createElement('option');
                opt.value = opt.text = String(h).padStart(2, '0');
                hourSelect.appendChild(opt);
            }
        });

        minuteSteps.forEach(m => {
            if (startHour === currentHour && m <= currentMinute) return;
            let opt = document.createElement('option');
            opt.value = opt.text = String(m).padStart(2, '0');
            minuteSelect.appendChild(opt);
        });

        // Якщо годин вже немає — автоматично переключаємо на завтра
        if (hourSelect.options.length === 0) {
            daySelect.value = 'Завтра';
            updateTimeOptions();
        }
    }
}


btn.onclick = () => {
    updateDayOptions();
    updateTimeOptions();
    modal.style.display = 'block';
};

daySelect.addEventListener('change', updateTimeOptions);

closeBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};


btn.onclick = () => {
    updateDayOptions();
    updateTimeOptions();
    modal.style.display = 'flex'; // flex для центрування
    document.body.style.overflow = 'hidden'; // блокуємо скрол
};

closeBtn.onclick = () => {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // повертаємо скрол
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};
