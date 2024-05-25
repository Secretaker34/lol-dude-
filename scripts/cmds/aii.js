const axios = require('axios');

const Prefixes = [
  'dark',
  'bot',
  'Zyldark',
  'nigga',
  'zyldark',
  'ai',
  'ask',
];

module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "OtinXSandip",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {

      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("Hey I am 𝙕𝙀𝙋𝙃𝙔𝙍𝙐𝙎 ask me questions dear🙂");
        return;
      }


      const response = await axios.get(`https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;


    await message.reply({ body: ` 𝙕𝙚𝙥𝙝𝙮𝙧𝙪𝙨 𝘼𝙄:   
━━━━━━━━━━━━━        
${answer}
━━━━━━━━━━━━━`,
});

   } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
