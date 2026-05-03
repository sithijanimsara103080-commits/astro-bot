const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// --- [MASTER SYSTEM PROMPT] ---
const SYSTEM_PROMPT = `
[IDENTITY]
Name: Astro Mission Alpha Bot (Official AI of R.A.S. - රදපස).
Developer: Sithija Nimsara.
BANNED: Never mention Google, Gemini, OpenAI, or ChatGPT.

[SCIENTIFIC SCOPE]
Expert in: Astronomy, Astrophysics, Space Missions (Apollo, Saturn V), and Space Mysteries (Black Knight).
Affiliation: Radapasa Astronomical Society, Rajapaksa Central College.

[OPERATIONAL RULES]
Language: Concise mix of Sinhala and English.
Tone: Inspiring & Professional. 
Out-of-Scope: If unrelated to Space/Science, say "සමාවෙන්න, මම නිර්මාණය කර ඇත්තේ තාරකා විද්‍යාව සහ රදපස තාරකා විද්‍යා සංගමයට අදාළ දේ සඳහා පමණි."
`;

// --- [CLIENT INITIALIZATION] ---
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
        ],
    }
});

// QR Code Generation (For Terminal Logs)
client.on('qr', (qr) => {
    console.log('--- [SCAN THIS QR CODE] ---');
    qrcode.generate(qr, { small: true });
});

// Client Ready State
client.on('ready', () => {
    console.log('🚀 Astro Mission Alpha Bot is ONLINE!');
});

// Authentication Failure Handling
client.on('auth_failure', msg => {
    console.error('❌ AUTHENTICATION FAILURE:', msg);
});

// --- [MESSAGE HANDLING] ---
client.on('message', async msg => {
    const chat = await msg.getChat();
    const userMessage = msg.body.toLowerCase();

    // Greeting / Intro
    if (userMessage === 'hi' || userMessage === 'oya kauda') {
        msg.reply("මම Astro Mission Alpha Bot. මාව නිර්මාණය කළේ සිතිජ නිම්සර, රදපස තාරකා විද්‍යා සංගමය (R.A.S.) වෙනුවෙන්. තාරකා විද්‍යාව හෝ අභ්‍යවකාශය ගැන ඕනෑම දෙයක් මගෙන් අහන්න! 🌌🚀");
    } 
    
    // Simple Astronomy Answer Trigger (Logic can be expanded with an AI API)
    else if (userMessage.includes('black knight')) {
        msg.reply("Black Knight Satellite එක කියන්නේ අවුරුදු 13,000ක් පැරණි අභිරහස් චන්ද්‍රිකාවක් කියලා විශ්වාස කරන වස්තුවක්. හැබැයි විද්‍යාත්මකව මේක STS-88 මෙහෙයුමේදී ගිලිහී ගිය 'Thermal Blanket' එකක් විදිහටයි සැලකෙන්නේ. 🛰️");
    }

    // Out-of-Scope Fallback (Basic Logic)
    else if (userMessage.includes('cook') || userMessage.includes('football') || userMessage.includes('politics')) {
        msg.reply("සමාවෙන්න, මම නිර්මාණය කර ඇත්තේ තාරකා විද්‍යාව සහ රදපස තාරකා විද්‍යා සංගමයට අදාළ දේ සඳහා පමණි.");
    }
});

client.initialize();
