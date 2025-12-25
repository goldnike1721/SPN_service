function findDataRadioAncestor(node) {
    while (node && node !== document) {
        if (node.attributes) {
            for (let i = 0; i < node.attributes.length; i++) {
                if (node.attributes[i].name.startsWith('data-radio')) {
                    return node;
                }
            }
        }
        node = node.parentElement;
    }
    return null;
}

function removeActiveByAttrNamePrefix(prefix) {
    document.querySelectorAll('*').forEach(el => {
        for (let i = 0; i < el.attributes.length; i++) {
            const name = el.attributes[i].name;
            if (name.startsWith(prefix) && el.classList.contains('active')) {
                el.classList.remove('active');
                break;
            }
        }
    });
}

document.addEventListener('click', (e) => {
    const box = findDataRadioAncestor(e.target);
    if (!box) return;

    const attrObj = Array.from(box.attributes).find(a => a.name.startsWith('data-radio'));
    if (!attrObj) return;
    const attrName = attrObj.name;

    const group = document.querySelectorAll(`[${attrName}]`);
    group.forEach(b => b.classList.remove('active'));
    box.classList.add('active');

    if (attrName === 'data-radio') {
        removeActiveByAttrNamePrefix('data-radio-agreement');
        removeActiveByAttrNamePrefix('data-radio-final');
    }

    if (attrName === 'data-radio-agreement') {
        removeActiveByAttrNamePrefix('data-radio-final');
    }
});

let selectedEstate = null;
let selectedAgreement = null;

document.getElementById('real-estate__container').addEventListener('click', function (e) {
    const target = e.target.closest('.services-section__estate-checkbox-box');
    if (!target) return;

    selectedEstate = target.id;
    tryShowFinalBlock();
});
document.getElementById('agreement-container').addEventListener('click', function (e) {
    const target = e.target.closest('.services-section__agreement-checkbox-box');
    if (!target) return;

    selectedAgreement = target.id;
    tryShowFinalBlock();
});

const estateMapping = {
    'opt-apartment': ['apartment', 'apartment-rent'],
    'opt-room': ['room', 'room-rent'],
    'opt-house': ['house', 'house-rent'],
    'opt-garage': ['garage', 'garage-rent'],
    'opt-earth': ['earth', 'earth-rent'],
    'opt-commerce': ['commerce', 'commerce-rent']
};

function tryShowFinalBlock() {
    const allBlocks = document.querySelectorAll('.services-section__final-block-general');
    const standartBlock = document.getElementById('standart');
    standartBlock.style.display = 'flex';

    if (!selectedEstate || !selectedAgreement) {
        allBlocks.forEach(block => block.style.display = 'none');
        standartBlock.style.display = 'flex';
        return;
    }

    standartBlock.style.display = 'none';

    const [buySellBlock, rentBlock] = estateMapping[selectedEstate] || [];
    let blockToShow = null;

    if (selectedAgreement === 'opt-buy' || selectedAgreement === 'opt-sell') {
        blockToShow = buySellBlock;
    } else if (selectedAgreement === 'opt-rent' || selectedAgreement === 'opt-lease-out') {
        blockToShow = rentBlock;
    }

    allBlocks.forEach(block => {
        block.style.display = (block.id === blockToShow) ? 'flex' : 'none';
    });
}

document.addEventListener('click', (e) => {
    const box = e.target.closest('[class*="checkbox-box-"]');
    if (!box) return;

    const group = box.parentNode;

    group.querySelectorAll('[class*="checkbox-box-"]').forEach(b => b.classList.remove('active'));

    box.classList.add('active');
});

function resetCheckboxes(level) {
    let selector;
    if (level === 'main') {
        selector = '[id^="apartment"], [id^="apartment-rent"], [id^="room"], [id^="room-rent"], [id^="house"], [id^="house-rent"], [id^="garage"], [id^="garage-rent"], [id^="earth"], [id^="earth-rent"], [id^="commerce"], [id^="commerce-rent"]';
    } else if (level === 'type') {
        selector = '[class*="checkbox-box-"]';
    }

    document.querySelectorAll(selector).forEach(el => {
        el.classList.remove('active');
    });
}

document.addEventListener('click', (e) => {
    if (e.target.closest('#opt-buy')) {
        resetCheckboxes('main');
    }
    if (e.target.closest('#opt-apartment')) {
        resetCheckboxes('type');
    }
});

(function () {
    const modal = document.getElementById('services-modal');
    const modalOpenBtn = document.getElementById('services-modal-open');
    const modalCloseBtn = modal ? modal.querySelector('.services-modal__close') : null;

    function openModal() {
        if (!modal) return;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    modalOpenBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const selectedEstate = document.querySelector('[data-radio].active');
        if (!selectedEstate) {
            showMessageServices('Оберіть обʼєкт нерухомості', true);
            return;
        }

        const selectedAgreement = document.querySelector('[data-radio-agreement].active');
        if (!selectedAgreement) {
            showMessageServices('Оберіть тип угоди', true);
            return;
        }

        let finalWrapper = null;
        const blocksChildren = document.querySelectorAll('#blocks-container > *');
        for (const ch of blocksChildren) {
            if (getComputedStyle(ch).display !== 'none') { finalWrapper = ch; break; }
        }
        if (!finalWrapper) {
            const allCandidates = document.querySelectorAll('[id^="apartment"], [id^="apartment-rent"], [id^="room"], [id^="room-rent"], [id^="house"], [id^="house-rent"], [id^="garage"], [id^="garage-rent"], [id^="earth"], [id^="earth-rent"], [id^="commerce"], [id^="commerce-rent"], .services-section__final-block-general');
            for (const c of allCandidates) {
                if (c instanceof Element && getComputedStyle(c).display !== 'none') { finalWrapper = c; break; }
            }
        }

        if (!finalWrapper) {
            showMessageServices('Оберіть вид будівлі/оренди/земельної ділянки/приміщення', true);
            return;
        }

        const groupsMap = new Map();
        finalWrapper.querySelectorAll('*').forEach(node => {
            if (!node.attributes) return;
            for (let i = 0; i < node.attributes.length; i++) {
                const name = node.attributes[i].name;
                if (name.startsWith('data-radio-final')) {
                    if (!groupsMap.has(name)) groupsMap.set(name, false);
                    if (node.classList && node.classList.contains('active')) groupsMap.set(name, true);
                }
            }
        });

        if (groupsMap.size === 0) {
            const anyFinalActive = finalWrapper.querySelector('.active');
            if (!anyFinalActive) {
                showMessageServices('Оберіть вид будівлі/оренди/земельної ділянки/приміщення', true);
                return;
            }
            openModal();
            return;
        }

        for (const [attrName, hasActive] of groupsMap.entries()) {
            if (!hasActive) {
                showMessageServices('Оберіть вид будівлі/оренди/земельної ділянки/приміщення', true);
                return;
            }
        }

        openModal();
    });
})();

const modalForm = document.querySelector('#services-modal form');

if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = modalForm.querySelector('input[name="name"]').value.trim();
        const phone = modalForm.querySelector('input[name="phone"]').value.trim();
        const email = modalForm.querySelector('input[name="email"]').value.trim();
        const estate = document.querySelector('[data-radio].active');
        const realEstate = estate ? estate.textContent.trim() : '';
        const agreement = document.querySelector('[data-radio-agreement].active');
        const dealType = agreement ? agreement.textContent.trim() : '';

        let finalWrapper = null;
        const blocksChildren = document.querySelectorAll('#blocks-container > *');
        for (const ch of blocksChildren) {
            if (getComputedStyle(ch).display !== 'none') { finalWrapper = ch; break; }
        }
        if (!finalWrapper) {
            showMessageServices('Оберіть вид будівлі/оренди/земельної ділянки/приміщення', true);
            return;
        }

        const buildingTypes = [...finalWrapper.querySelectorAll(
            '[data-radio-final-house].active, ' +
            '[data-radio-final-house-rent-general].active, ' +
            '[data-radio-final-room].active, ' +
            '[data-radio-final-room-rent-general].active, ' +
            '[data-radio-final-house-some].active, ' +
            '[data-radio-final-house-some-rent-general].active, ' +
            '[data-radio-final-garage].active, ' +
            '[data-radio-final-garage-rent-general].active'
        )].map(el => el.textContent.trim());

        const rentTypes = [...finalWrapper.querySelectorAll(
            '[data-radio-final-house-rent].active, ' +
            '[data-radio-final-room-rent].active, ' +
            '[data-radio-final-house-some-rent].active'
        )].map(el => el.textContent.trim());

        const landTypes = [...finalWrapper.querySelectorAll(
            '[data-radio-final-earth].active, ' +
            '[data-radio-final-earth-rent-general].active'
        )].map(el => el.textContent.trim());

        const roomTypes = [...finalWrapper.querySelectorAll(
            '[data-radio-final-commerce].active, ' +
            '[data-radio-final-commerce-rent-general].active'
        )].map(el => el.textContent.trim());


        if (!name || !phone || !email || !realEstate || !dealType) {
            showMessageServices('Заповніть усі обовʼязкові поля', true);
            return;
        }

        if (
            buildingTypes.length === 0 &&
            rentTypes.length === 0 &&
            landTypes.length === 0 &&
            roomTypes.length === 0
        ) {
            showMessageServices('Оберіть вид будівлі/оренди/земельної ділянки/приміщення', true);
            return;
        }

        const createdAt = new Date().toLocaleString('uk-UA');

        try {
            const res = await fetch('/api/checkbox-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    createdAt,
                    realEstate,
                    dealType,
                    buildingTypes,
                    rentTypes,
                    landTypes,
                    roomTypes
                })
            });

            const result = await res.json();
            if (result.success) {
                showMessageServices('Заявка надіслана! Чекайте на дзвінок.');
                modalForm.reset();

                setTimeout(() => {
                    location.reload();
                }, 1500);
            } else {
                showMessageServices(result.message || '❌ Не вдалося відправити дані', true);
            }

        } catch (err) {
            console.error(err);
            showMessageServices('❌ Сталася помилка при зʼєднанні!', true);
        }
    });
}

function showMessageServices(text, isError = false) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = text;
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '40px';
    msgDiv.style.left = '50%';
    msgDiv.style.transform = 'translateX(-50%)';
    msgDiv.style.backgroundColor = isError ? '#b22222' : '#013b46';
    msgDiv.style.color = 'white';
    msgDiv.style.padding = '20px 10px';
    msgDiv.style.borderRadius = '8px';
    msgDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    msgDiv.style.zIndex = 9999;
    msgDiv.style.textAlign = 'center';
    msgDiv.style.fontSize = '16px';
    msgDiv.style.fontWeight = '500';
    msgDiv.style.width = '90%';
    msgDiv.style.maxWidth = '700px';
    msgDiv.style.opacity = '0';
    msgDiv.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(msgDiv);

    requestAnimationFrame(() => { msgDiv.style.opacity = '1'; });

    setTimeout(() => {
        msgDiv.style.opacity = '0';
        setTimeout(() => msgDiv.remove(), 300);
    }, 2000);
}