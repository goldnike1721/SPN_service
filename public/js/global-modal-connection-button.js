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

const modalForm = document.querySelector('.callback-menu-form');
const modalOverlay = document.getElementById('callbackMenu');

modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = modalForm.querySelector('input[type="text"]').value.trim();
    const phone = modalForm.querySelector('input[type="tel"]').value.trim();
    const email = modalForm.querySelector('input[type="email"]').value.trim();

    if (!name || !phone || !email) {
        alert('Будь ласка, заповніть усі поля!');
        return;
    }

    const createdAt = new Date().toLocaleString();

    const data = { name, phone, email, createdAt };

    try {
        const res = await fetch('/api/modal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
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
            msgDiv.style.maxWidth = '700px';
            document.body.appendChild(msgDiv);

            setTimeout(() => {
                msgDiv.remove();
                modalOverlay.style.display = 'none';
                modalForm.reset();
            }, 2000);
        } else {
            alert('Сталася помилка. Спробуйте ще раз.');
        }

    } catch (err) {
        console.error(err);
        alert('Сталася помилка. Спробуйте ще раз.');
    }
});

const phoneInput = modalForm.querySelector('input[type="tel"]');
phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});