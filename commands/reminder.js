import * as akademikHandler from './akademik.js';
import tugasHandler from './tugas.js';
import config from '../config.js';
import logger from '../utils/logger.js';
import moment from 'moment-timezone';

moment.locale('id');
moment.tz.setDefault("Asia/Jakarta");

// 🔔 Jadwal hari ini (pagi jam 06.00)
const sendMorningReminder = async (sock) => {
  try {
    const jadwalHariIni = await akademikHandler.getJadwalHariIni();
    let message = `🌅 *SELAMAT PAGI KELAS 1D!*\n\n📌 Berikut adalah jadwal kuliah *hari ini* (${jadwalHariIni.hari}):\n\n`;

    if (jadwalHariIni.jadwal.length === 0) {
      message += `✅ Tidak ada jadwal kuliah hari ini. Gunakan waktumu dengan produktif ya! 🚀`;
    } else {
      jadwalHariIni.jadwal.forEach((item, index) => {
        message += `🔹 ${index + 1}. ${item.matkul}\n    🕒 ${item.jam} | 📍${item.ruang}\n`;
      });
      message += `\n⏰ Jangan lupa hadir tepat waktu ya!`;
    }

    for (const groupId of config.groupIds) {
      await sock.sendMessage(groupId, { text: message });
    }

    logger.info("📨 Morning reminder terkirim ke semua grup");
  } catch (error) {
    logger.error(`❗ Error mengirim morning reminder: ${error.message}`);
  }
};

// 🔔 Jadwal besok (opsional, malam jam 21.00)
const sendEveningReminder = async (sock) => {
  try {
    const jadwalBesok = await akademikHandler.getJadwalBesok();
    let message = `🌙 *SELAMAT MALAM KELAS 1D!*\n\n📌 Berikut adalah jadwal kuliah *besok* (${jadwalBesok.hari}):\n\n`;

    if (jadwalBesok.jadwal.length === 0) {
      message += `✅ Tidak ada jadwal kuliah besok. Istirahat yang cukup ya! 😴`;
    } else {
      jadwalBesok.jadwal.forEach((item, index) => {
        message += `🔹 ${index + 1}. ${item.matkul}\n    🕒 ${item.jam} | 📍${item.ruang}\n`;
      });
      message += `\n🧠 Siapkan perlengkapan dari malam ini ya!`;
    }

    for (const groupId of config.groupIds) {
      await sock.sendMessage(groupId, { text: message });
    }

    logger.info("📨 Evening reminder terkirim ke semua grup");
  } catch (error) {
    logger.error(`❗ Error mengirim evening reminder: ${error.message}`);
  }
};

// 🔔 Reminder otomatis tugas aktif (jam 19.00)
const sendTasksReminder = async (sock) => {
  try {
    const tasks = await tugasHandler.getTugasList();
    let message = `📋 *REMINDER TUGAS KULIAH*\n\n`;

    if (tasks.length === 0) {
      message += `✅ Saat ini belum ada tugas tercatat.`;
    } else {
      message += `Berikut tugas yang harus diselesaikan:\n\n`;
      tasks.forEach(task => {
        const date = new Date(task.createdAt).toLocaleDateString('id-ID');
        message += `🆔 *${task.id}*\n📌 ${task.task}\n🗓️ Ditambahkan: ${date}\n\n`;
      });
    }

    for (const groupId of config.groupIds) {
      await sock.sendMessage(groupId, { text: message });
    }

    logger.info("📨 Task reminder terkirim ke semua grup");
  } catch (error) {
    logger.error(`❗ Error mengirim task reminder: ${error.message}`);
  }
};

// 🔔 Manual command !reminder tugas
const sendTugasReminderManual = async (sock, chatId) => {
  try {
    const tasks = await tugasHandler.getTugasList();
    let message = `📋 *DAFTAR TUGAS KULIAH AKTIF*\n\n`;

    if (tasks.length === 0) {
      message += `✅ Tidak ada tugas saat ini.`;
    } else {
      tasks.forEach(task => {
        const date = new Date(task.createdAt).toLocaleDateString('id-ID');
        message += `🆔 *${task.id}*\n📌 ${task.task}\n🗓️ Ditambahkan: ${date}\n\n`;
      });
    }

    await sock.sendMessage(chatId, { text: message });
    logger.info(`📨 Reminder tugas manual dikirim ke ${chatId}`);
  } catch (error) {
    logger.error(`❗ Error mengirim tugas manual: ${error.message}`);
    await sock.sendMessage(chatId, { text: "❌ Gagal mengambil daftar tugas." });
  }
};

// 🔔 Manual command !reminder jadwal
const sendJadwalReminder = async (sock, chatId) => {
  try {
    const jadwal = await akademikHandler.getJadwalHariIni();
    const message = akademikHandler.formatJadwal(jadwal);
    await sock.sendMessage(chatId, { text: message });
    logger.info(`📨 Reminder jadwal manual dikirim ke ${chatId}`);
  } catch (error) {
    logger.error(`❗ Error mengirim jadwal manual: ${error.message}`);
  }
};

// 🔁 Ekspor semua fungsi reminder
export default {
  sendMorningReminder,
  sendEveningReminder,
  sendTasksReminder,
  sendTugasReminderManual,
  sendJadwalReminder
};
