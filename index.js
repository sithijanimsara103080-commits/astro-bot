const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('--- QR CODE BELOW ---');
});

client.on('ready', () => console.log('Astro Bot is Online!'));

client.on('message', async (msg) => {
    try {
        const contact = await msg.getContact();
        const response = await axios.post(`${process.env.SUPABASE_URL}/functions/v1/process-message`, {
            phone_number: contact.number,
            user_name: contact.pushname || "Student",
            message: msg.body
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data?.reply) await msg.reply(response.data.reply);
    } catch (err) {
        console.error("Error:", err.message);
    }
});

client.initialize();
