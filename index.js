const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config();

// 🚀 බොට්ගේ පෝන් නම්බර් එක (94 සහ බිංදුව නැතිව ඉතිරි ටික)
const myNumber = "94718243750";

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true, 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ] 
    }
});

// --- PAIRING CODE LOGIC ---
client.on('qr', async (qr) => {
    // Railway logs වල QR එක පේන්න තියමු
    qrcode.generate(qr, { small: true });
    
    console.log('--------------------------------------------');
    console.log('🔔 QR RECEIVED! REQUESTING PAIRING CODE...');
    
    try {
        // Pairing Code එක ඉල්ලීම
        const code = await client.requestPairingCode(myNumber);
        
        console.log('--------------------------------------------');
        console.log('🚀 YOUR ASTRO BOT PAIRING CODE IS:');
        console.log(`       >>>  ${code}  <<<       `);
        console.log('--------------------------------------------');
        console.log('HOW TO USE:');
        console.log('1. Open WhatsApp -> Settings -> Linked Devices.');
        console.log('2. Tap "Link a Device".');
        console.log('3. Tap "Link with phone number instead".');
        console.log('4. Enter the code shown above.');
        console.log('--------------------------------------------');
    } catch (err) {
        console.error("❌ Pairing code error:", err);
    }
});

client.on('ready', () => {
    console.log('--------------------------------------------');
    console.log('✅ ASTRO MISSION ALPHA BOT IS ONLINE!');
    console.log('--------------------------------------------');
});

client.on('message', async (msg) => {
    try {
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const body = msg.body ? msg.body.toLowerCase() : "";

        // --- GROUP & SAFETY LOGIC ---
        if (chat.isGroup) {
            const isMentioned = msg.mentionedIds.includes(client.info.wid._serialized);
            // බොට්ව Mention කළොත් හෝ "Astro" කියන වචනය තිබ්බොත් විතරක් රිප්ලයි කරයි
            const containsKeywords = body.includes('astro') || body.includes('රදපස'); 

            if (!isMentioned && !containsKeywords) return; 
        }

        // Supabase Edge Function එකට දත්ත යැවීම
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
        console.error("❌ Processing error:", err.message);
    }
});

client.initialize();
