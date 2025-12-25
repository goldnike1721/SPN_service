const workStagesForm = document.querySelector('.work-stages-section__form');

if (workStagesForm) {
    workStagesForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const free = workStagesForm.querySelector('input[name="free"]').value.trim();
        const name = workStagesForm.querySelector('input[name="name"]').value.trim();
        const phone = workStagesForm.querySelector('input[name="phone"]').value.trim();
        const email = workStagesForm.querySelector('input[name="email"]').value.trim();
        const agree = workStagesForm.querySelector('input[name="agree"]').checked;
        const news = workStagesForm.querySelector('input[name="news"]').checked;

        if (!name || !phone || !email || !agree || !news) {
            alert('Будь ласка, заповніть усі поля і поставте обидві галочки!');
            return;
        }

        const createdAt = new Date().toLocaleString('uk-UA');

        const data = { free, name, phone, email, agree, news, createdAt };

        try {
            const res = await fetch('/api/work-stages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.success) {
                const msgDiv = document.createElement('div');
                msgDiv.textContent = 'Ви успішно підписалися на розсилку';
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
                    workStagesForm.reset();
                }, 2000);
            } else {
                alert('Сталася помилка. Спробуйте ще раз.');
            }

        } catch (err) {
            console.error(err);
            alert('Сталася помилка. Спробуйте ще раз.');
        }
    });

    const phoneInput = workStagesForm.querySelector('input[name="phone"]');
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}