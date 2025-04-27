// config.js (ESM)
import dotenv from 'dotenv';
dotenv.config();

const config = {
  botName: "AssistenKampus",
  owner: ["6281358959349@s.whatsapp.net"],
  groupIds: ["6282333701190-1598403147@g.us",
"120363399448132967@g.us",
"120363303003832667@g.us"
],

  geminiApiKey: process.env.GEMINI_API_KEY || "AIzaSyAMKZ-AiXiJv0A43bC92ERTLMi4Ywwx_5c",

  reminderSettings: {
    jadwalPagi: "0 6 * * *",
    jadwalMalam: "0 19 * * *",
    tugasMalam: "0 19 * * *",
  },

  keywordJadwal: "!jadwal",
  keywordTugas: "!tugas",

  systemCommands: {
    prefix: "!",
    allowedUsers: ["62812345678@s.whatsapp.net"],
  }
};

export default config;
