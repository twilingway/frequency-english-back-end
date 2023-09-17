// import axios from "axios";
import { config } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import axios, { AxiosRequestConfig } from 'axios';
import { debug } from './helpers';
import path from 'path';

import fs from 'fs';
import util from 'util';

config();

function checkFile(filename: string) {
  fs.access(__dirname + '/src/translations/' + filename, (err) => {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
}

const axiosConfig: AxiosRequestConfig = {
  method: 'POST',
  url: process.env.YANDEX_API_SPEECH_URL,
  headers: {
    Authorization: 'Api-Key ' + process.env.YANDEX_API_SPEECH,
    'Content-Type': 'multipart/form-data',
  },
  responseType: 'stream',
  data: {
    text: 'You',
    lang: 'en-US',
    voice: 'john',
    speed: '0.8',
    format: 'mp3',
    folderId: process.env.YANDEX_API_SPEECH_FOLDER_ID,
    sampleRateHertz: '48000',
  },
};
// axios(axiosConfig).then(async (response) => {
//   console.log("response :>> ", response);
//   await fs.promises.writeFile(__dirname + "/You.mp3", response.data, {
//     encoding: "binary",
//   });
// });

// axios(axiosConfig).then((response) => {
//   console.log("response :>> ", response);
//   const stream = response.data;

//   stream.on("data", (data) => {
//     console.log(data);
//     fs.promises.writeFile(__dirname + "/src/translations/" + "/You.mp3", data, {
//       encoding: "binary",
//     });
//   });

//   stream.on("end", () => {
//     console.log("stream done");
//   });

// });

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_API_TOKEN || '';
const webAppUrl = 'https://yandex.ru';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Ниже появятся копки, заполни форму', {
      reply_markup: {
        keyboard: [
          [
            { text: 'Заполнить форму', web_app: { url: webAppUrl } },
            { text: 'Заполнить форму2', web_app: { url: webAppUrl } },
          ],

          [{ text: 'Заполнить форму4' }],
        ],
      },
      disable_web_page_preview: true,
    });

    await bot.sendMessage(chatId, 'Выбери перевод слова You', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Ты, Вы', callback_data: 'Ты, Вы' },
            { text: 'Перевод 2', callback_data: 'Перевод 2' },
          ],
          [
            // { text: "Перевод 3", web_app: { url: webAppUrl } },
            { text: 'Перевод 3', callback_data: 'Перевод 3' },
            { text: 'Перевод 4', callback_data: 'Перевод 4' },
          ],
        ],
      },
    });
  }
  // send a message to the chat acknowledging receipt of their message
  // await bot.sendMessage(chatId, "Received your message");
});

bot.on('callback_query', async (query) => {
  if (query?.data === 'Ты, Вы') {
    const stream = fs.createReadStream(
      path.resolve(__dirname, 'src', 'translations', 'You.mp3'),
    );
    const fileOptions = {
      // Explicitly specify the file name.
      filename: 'You.mp3',
      // Explicitly specify the MIME type.
      contentType: 'application/octet-stream',
    };

    // await bot
    //   .sendAudio(query.message?.chat?.id, stream, {}, fileOptions)
    //   .then((res) => console.log("res >> ", res));
    // "AwACAgIAAxkDAAOaZEuviQfuGsy9ML34u8jzfr3_lXUAAoEqAAIonWFKSebYcwwOCIMvBA";
    await bot
      .sendVoice(
        query.message?.chat?.id,
        'AwACAgIAAxkDAAOaZEuviQfuGsy9ML34u8jzfr3_lXUAAoEqAAIonWFKSebYcwwOCIMvBA',
        {
          // caption: "You - Ты, Вы2",
        },
        // fileOptions
      )
      .then((res) => console.log('res2 >> ', res))
      .catch((error) => console.log('error :>> ', error));
  }
  bot.sendMessage(query.message?.chat?.id, query?.data);
});
