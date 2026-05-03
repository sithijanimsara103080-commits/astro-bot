const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
require('dotenv').config();

// 🚀 බොට්ගේ පෝන් නම්බර් එක
const myNumber = "94781163740";

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

// --- මෙතන QR එක PRINT වෙන්නේ නැහැ, CODE එක විතරයි ඉල්ලන්නේ ---
client.on('qr', async (qr) => {
    console.log('--------------------------------------------');
    console.log('⏳ WAITING FOR PAIRING CODE FROM WHATSAPP...');
    
    try {
        const code = await client.requestPairingCode(myNumber);
        console.log('--------------------------------------------');
        console.log('🚀 YOUR ASTRO BOT PAIRING CODE IS:');
        console.log(`\n       >>>  ${code}  <<<       \n`);
        console.log('--------------------------------------------');
        console.log('1. Open WhatsApp -> Linked Devices');
        console.log('2. Link with phone number instead');
        console.log('3. Enter the code above');
    } catch (err) {
        console.error("❌ Pairing Error:", err.message);
    }
});

client.on('ready', () => {
    console.log('✅ ASTRO BOT IS ONLINE!');
});

client.on('message', async (msg) => {
    try {
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const body = msg.body ? msg.body.toLowerCase() : "";

        if (chat.isGroup) {
            const isMentioned = msg.mentionedIds.includes(client.info.wid._serialized);
            if (!isMentioned && !body.includes('astro')) return;
        }

        const response = await axios.post(`${process.env.SUPABASE_URL}/functions/v1/process-message`, {
            phone_number: contact.number,
            user_name: contact.pushname || "Alpha Explorer",
            message: msg.body,
            is_group: chat.isGroup
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.reply) {
            await msg.reply(response.data.reply);
        }
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
});

client.initialize();
