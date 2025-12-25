const adviceForm = document.querySelector('.start-section__form');
const phoneInput = document.getElementById('phoneInput');

phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});

adviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = adviceForm.querySelector('[name="name"]').value.trim();
    const phone = adviceForm.querySelector('[name="phone"]').value.trim();
    const email = adviceForm.querySelector('[name="email"]').value.trim();

    if (!name || !phone || !email) {
        showMessage('Будь ласка, заповніть усі поля!', 'red');
        return;
    }

    const createdAt = new Date().toLocaleString();
    const data = { name, phone, email, createdAt };

    try {
        const res = await fetch('/api/advice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
            showMessage('Заявка надіслана! Чекайте на дзвінок.', '#013b46');
            adviceForm.reset();
        } else {
            showMessage('Сталася помилка. Спробуйте ще раз.', 'red');
        }
    } catch (err) {
        console.error(err);
        showMessage('Сталася помилка. Спробуйте ще раз.', 'red');
    }
});

function showMessage(text, bgColor) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = text;
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '40px';
    msgDiv.style.left = '50%';
    msgDiv.style.transform = 'translateX(-50%)';
    msgDiv.style.backgroundColor = bgColor;
    msgDiv.style.color = 'white';
    msgDiv.style.padding = '20px 30px';
    msgDiv.style.borderRadius = '12px';
    msgDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    msgDiv.style.zIndex = 9999;
    msgDiv.style.textAlign = 'center';
    msgDiv.style.fontSize = '16px';
    msgDiv.style.fontWeight = '500';
    msgDiv.style.width = '90%';
    msgDiv.style.maxWidth = '700px';
    msgDiv.style.transition = 'all 0.3s ease';
    document.body.appendChild(msgDiv);

    setTimeout(() => {
        msgDiv.style.opacity = '0';
        msgDiv.style.transform = 'translateX(-50%) translateY(-20px)';
    }, 2000);

    setTimeout(() => {
        msgDiv.remove();
    }, 2500);
}
