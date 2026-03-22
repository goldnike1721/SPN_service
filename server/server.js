const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/partials', express.static(path.join(__dirname, '../views/partials')));
// ==========================
// API маршрути для JSON
// ==========================
app.get('/api/blocks', (req, res) => {
    res.sendFile(path.join(__dirname, '../server/routes/api/blocks.json'));
});
app.get('/api/agreement', (req, res) => {
    res.sendFile(path.join(__dirname, '../server/routes/api/agreement.json'));
});
app.get('/api/real-estate', (req, res) => {
    res.sendFile(path.join(__dirname, '../server/routes/api/real-estate.json'));
});
app.get('/api/start-section', (req, res) => {
    res.sendFile(path.join(__dirname, '../server/routes/api/start-section.json'));
});
app.get('/api/work-stages', (req, res) => {
    res.sendFile(path.join(__dirname, '../server/routes/api/work-stages.json'));
});
// ==========================
// ТЕЛЕГРАМ ДЛЯ СТАРТУ
// ==========================
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const callbackBot = new TelegramBot(process.env.TELEGRAM_API_CALL_BACK);
callbackBot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`Натиснули /start у Callback Bot! Chat ID: ${chatId}`);
    callbackBot.sendMessage(chatId, 'Привіт! Твій Chat ID отримано і виведено в термінал.');
});
callbackBot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    console.log(`Натиснули кнопку у Callback Bot! Chat ID: ${chatId}`);
    callbackBot.answerCallbackQuery(query.id, { text: 'Chat ID отримано!' });
});

const adviceBot = new TelegramBot(process.env.TELEGRAM_API_ADVICE);
adviceBot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`Натиснули /start у Advice Bot! Chat ID: ${chatId}`);
    adviceBot.sendMessage(chatId, `Привіт! Твій Chat ID: ${chatId}`);
});
adviceBot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    console.log(`Натиснули кнопку у Advice Bot! Chat ID: ${chatId}`);
    adviceBot.answerCallbackQuery(query.id, { text: `Chat ID: ${chatId}` });
});

const modalBot = new TelegramBot(process.env.TELEGRAM_API_MODAL);
modalBot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`Натиснули /start у Modal Bot! Chat ID: ${chatId}`);
    modalBot.sendMessage(chatId, `Привіт! Твій Chat ID: ${chatId}`);
});
modalBot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    console.log(`Натиснули кнопку у Modal Bot! Chat ID: ${chatId}`);
    modalBot.answerCallbackQuery(query.id, { text: `Chat ID: ${chatId}` });
});

const workStagesBot = new TelegramBot(process.env.TELEGRAM_API_WORK_STAGES);
workStagesBot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`Натиснули /start у Work Stages Bot! Chat ID: ${chatId}`);
    workStagesBot.sendMessage(chatId, `Привіт! Твій Chat ID: ${chatId}`);
});
workStagesBot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    console.log(`Натиснули кнопку у Work Stages Bot! Chat ID: ${chatId}`);
    workStagesBot.answerCallbackQuery(query.id, { text: `Chat ID: ${chatId}` });
});

const chekboxBot = new TelegramBot(process.env.TELEGRAM_API_CHEKBOX);
chekboxBot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`Натиснули /start у Chekbox Bot! Chat ID: ${chatId}`);
    chekboxBot.sendMessage(chatId, `Привіт! Твій Chat ID: ${chatId}`);
});
chekboxBot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    console.log(`Натиснули кнопку у Chekbox Bot! Chat ID: ${chatId}`);
    chekboxBot.answerCallbackQuery(query.id, { text: `Chat ID: ${chatId}` });
});
// ==========================
// EXCEL GOOGLE
// ==========================
const { google } = require('googleapis');
require('dotenv').config();

const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE || 'Лист1!A:N';

async function addToGoogleSheet(data = {}) {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

        // фікс переносів
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        const meta = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'A:A',
        });
        const rowCount = meta.data.values ? meta.data.values.length : 0;
        const nextNumber = rowCount === 0 ? 1 : rowCount;

        const callbackValue =
            (data.callback && String(data.callback).trim()) ||
            (data.callbackTime && String(data.callbackTime).trim()) ||
            (data.feedback && String(data.feedback).trim()) ||
            (data.message && String(data.message).trim()) ||
            (data.comment && String(data.comment).trim()) ||
            (data.question && String(data.question).trim()) ||
            '';

        const values = [[
            nextNumber,
            data.name || '',
            data.phone || '',
            data.email || data.mail || '',
            callbackValue,
            data.realEstate || data.object || '',
            data.dealType || data.typeDeal || '',
            data.buildingType || data.building || '',
            data.rentType || data.rent || '',
            data.landType || '',
            data.roomType || '',
            data.createdAt || new Date().toISOString(),
            data.free || data.text || '',
            data.note || ''
        ]];

        console.log('→ addToGoogleSheet incoming data:', data);
        console.log('→ Will append values:', values[0]);

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: SHEET_RANGE,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values },
        });

        console.log('✅ Додано в Google Sheet');
        return true;
    } catch (err) {
        console.error('❌ addToGoogleSheet error:', err);
        throw err;
    }
}

module.exports = addToGoogleSheet;
// ==========================
// Модальне повідомлення звʼязку
// ==========================
app.post('/api/send-callback', async (req, res) => {
    const { name, phone, callbackTime, createdAt } = req.body;
    const chatId = process.env.TELEGRAM_CHAT_ID_CALL_BACK;

    if (!chatId) {
        return res.status(500).json({ error: 'Chat ID not set in .env' });
    }

    const message = `
📞 Нова заявка на дзвінок:
Ім'я: ${name}
Телефон: ${phone}
Дата та час для дзвінка: ${callbackTime}
Час створення заявки: ${createdAt}
    `;

    try {
        await callbackBot.sendMessage(chatId, message);

        await addToGoogleSheet({
            name,
            phone,
            callbackTime,
            createdAt,
            note: "Зворотній звʼязок"
        });

        res.json({ success: true });
    } catch (err) {
        console.error("❌ Помилка при обробці заявки:", err);
        res.status(500).json({ error: 'Помилка при відправці' });
    }
});
// ==========================
// Початкове повідомлення
// ==========================
const adviceChatId = process.env.TELEGRAM_CHAT_ID_ADVICE;

app.post('/api/advice', async (req, res) => {
    const { name, phone, email, createdAt } = req.body;

    if (!name || !phone || !email) {
        return res.json({ success: false, message: 'Поля не заповнені' });
    }

    const message = `
📩 Нова заявка на консультацію:
Ім'я: ${name}
Телефон: ${phone}
E-mail: ${email}
Дата створення заявки: ${createdAt}
    `;

    try {
        await adviceBot.sendMessage(adviceChatId, message);

        await addToGoogleSheet({
            name,
            phone,
            email,
            createdAt,
            note: "Консультація"
        });

        res.json({ success: true });
    } catch (err) {
        console.error("❌ Помилка у /api/advice:", err);
        res.status(500).json({ error: "Помилка при відправці" });
    }
});
// ==========================
// Модалка на повідомлення
// ==========================
app.post('/api/modal', async (req, res) => {
    const { name, phone, email, createdAt } = req.body;
    const chatId = process.env.TELEGRAM_CHAT_ID_MODAL;

    if (!name || !phone || !email) {
        return res.json({ success: false, message: 'Поля не заповнені' });
    }

    const message = `
📬 Нова заявка з модальної форми:
Ім'я: ${name}
Телефон: ${phone}
E-mail: ${email}
Дата та час створення заявки: ${createdAt}
    `;

    try {
        await modalBot.sendMessage(chatId, message);

        await addToGoogleSheet({
            name,
            phone,
            email,
            createdAt,
            note: "Модальне вікно"
        });

        res.json({ success: true });
    } catch (err) {
        console.error("❌ Помилка при відправці заявки:", err);
        res.status(500).json({ error: 'Помилка при відправці' });
    }
});
// ==========================
// Work Stages форма
// ==========================
app.post('/api/work-stages', async (req, res) => {
    const { free, name, phone, email, createdAt } = req.body;
    const chatId = process.env.TELEGRAM_CHAT_ID_WORK_STAGES;

    if (!name || !phone || !email) {
        return res.json({ success: false, message: 'Поля не заповнені' });
    }

    const message = `
📝 Нова заявка на розсилку (підписку):
Текстове поле: ${free || '-'}
Ім'я: ${name}
Телефон: ${phone}
E-mail: ${email}
Дата та час створення: ${createdAt}
    `;

    try {
        await workStagesBot.sendMessage(chatId, message);

        await addToGoogleSheet({
            name,
            phone,
            email,
            createdAt,
            free,
            note: "Розсилка"
        });

        res.json({ success: true });
    } catch (err) {
        console.error("❌ Помилка при відправці заявки:", err);
        res.status(500).json({ error: 'Помилка при відправці' });
    }
});
// ==========================
// Checkbox форма (в ТГ тільки)
// ==========================
app.post('/api/checkbox-form', async (req, res) => {
    const {
        name,
        phone,
        email,
        realEstate,
        dealType,
        buildingTypes,
        rentTypes,
        landTypes,
        roomTypes,
        createdAt
    } = req.body;

    const chatId = process.env.TELEGRAM_CHAT_ID_CHEKBOX;

    if (!name || !phone || !email || !realEstate || !dealType) {
        return res.status(400).json({ success: false, message: 'Заповніть усі обовʼязкові поля' });
    }

    let message = `✅ Нова заявка з чекбокс-форми:\n`;
    message += `Ім’я: ${name}\n`;
    message += `Телефон: ${phone}\n`;
    message += `E-mail: ${email}\n`;
    message += `Обʼєкт нерухомості: ${realEstate}\n`;
    message += `Тип угоди: ${dealType}\n`;

    if (buildingTypes?.length) message += `Вид будівлі: ${buildingTypes.join(', ')}\n`;
    if (rentTypes?.length) message += `Вид оренди: ${rentTypes.join(', ')}\n`;
    if (landTypes?.length) message += `Вид земельної ділянки: ${landTypes.join(', ')}\n`;
    if (roomTypes?.length) message += `Вид приміщення: ${roomTypes.join(', ')}\n`;

    message += `Дата: ${createdAt}`;

    try {
        await chekboxBot.sendMessage(chatId, message);

        await addToGoogleSheet({
            name,
            phone,
            email,
            realEstate,
            dealType,
            buildingType: buildingTypes?.join(', ') || '',
            rentType: rentTypes?.join(', ') || '',
            landType: landTypes?.join(', ') || '',
            roomType: roomTypes?.join(', ') || '',
            createdAt,
            note: 'Чекбокс форма'
        });

        res.json({ success: true });
    } catch (err) {
        console.error('❌ Помилка при обробці заявки (чекбокс):', err);
        res.status(500).json({ success: false, error: 'Помилка при відправці' });
    }
});
// ==========================
// Статичні сторінки
// ==========================
app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
// ==========================
// Запуск сервера
// ==========================
app.listen(port, () => {
    console.log(`✅ Сервер працює: http://localhost:${port}`);
});