document.querySelectorAll('[data-radio]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-agreement]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-agreement]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-house-rent-general]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-house-rent-general]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-house-rent]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-house-rent]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-house]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-house]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-room-rent-general]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-room-rent-general]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-room-rent]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-room-rent]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-room]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-room]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-house-some-rent-general]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-house-some-rent-general]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-house-some-rent]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-house-some-rent]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-house-some]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-house-some]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-garage-rent-general]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-garage-rent-general]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-garage-rent]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-garage-rent]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-garage]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-garage]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-earth-rent-general]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-earth-rent-general]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-earth-rent]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-earth-rent]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-earth]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-earth]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-commerce-rent-general]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-commerce-rent-general]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-commerce-rent]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-commerce-rent]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
document.querySelectorAll('[data-radio-final-commerce]').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('[data-radio-final-commerce]').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
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

document.getElementById('opt-buy').addEventListener('click', () => resetCheckboxes('main'));
document.getElementById('opt-apartment').addEventListener('click', () => resetCheckboxes('type'));