import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { StableService } from 'src/stable/stable.service';
import { YandexService } from 'src/yandex/yandex.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly stable: StableService,
    private readonly yandex: YandexService,
  ) {}
  onModuleInit() {
    this.botMessage();
  }
  botMessage() {
    const token = process.env.TELEGRAM_API_TOKEN || '';
    const url = process.env.URL_PUBLIC;
    // const webAppUrl = 'https://twiling.ru';
    // const TelegramBot = require('node-telegram-bot-api');

    // const token = 'YOUR_ACCESS_TOKEN';
    // console.log('token :>> ', token);
    const bot = new TelegramBot(token, {
      // webHook: {
      // }
    });

    bot.setWebHook(`${url}/bot${token}`);

    bot.on('message', async (msg) => {
      console.log('msg :>> ', msg);
      const chatId = msg.chat.id;
      const text = msg.text;
      console.log('text :>> ', text);
      try {
        if (text?.startsWith('/prompt')) {
          const base64 = await this.stable.txt2img(
            text.replace('/prompt', '').trim(),
          );
          const image = Buffer.from(base64, 'base64');

          if (image) {
            await bot.sendPhoto(chatId, image);
          }
        }
      } catch (error) {
        console.log('error :>> ', error);
      }

      if (text === '/start') {
        // await bot.sendMessage(chatId, 'Ниже появятся копки, заполни форму', {
        //   reply_markup: {
        //     keyboard: [
        //       [
        //         { text: 'Заполнить форму1', web_app: { url: webAppUrl } },
        //         { text: 'Заполнить форму22', web_app: { url: webAppUrl } },
        //       ],

        //       [{ text: 'Заполнить форму4' }],
        //     ],
        //   },
        //   disable_web_page_preview: true,
        // });

        await bot.sendMessage(
          chatId,
          'Выберите Prompt или воспользуйтесь /prompt',
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Dog in yellow hat',
                    callback_data: 'Dog in yellow hat',
                  },
                  {
                    text: 'cat in red boots',
                    callback_data: 'cat in red boots',
                  },
                ],
              ],
            },
          },
        );

        // await bot.sendMessage(chatId, 'Выбери перевод слова You', {
        //   reply_markup: {
        //     inline_keyboard: [
        //       [
        //         { text: 'Ты, Вы', callback_data: 'Ты, Вы' },
        //         { text: 'Перевод 2', callback_data: 'Перевод 2' },
        //       ],
        //       [
        //         // { text: "Перевод 3", web_app: { url: webAppUrl } },
        //         { text: 'Перевод 3', callback_data: 'Перевод 3' },
        //         { text: 'Перевод 4', callback_data: 'Перевод 4' },
        //       ],
        //     ],
        //   },
        // });
      }
      // send a message to the chat acknowledging receipt of their message
      // await bot.sendMessage(chatId, "Received your message");
    });

    bot.on('callback_query', async (query) => {
      if (query?.data) {
        try {
          // return this.yandex.generateResponse('You');
          const base64 = await this.stable.txt2img(query?.data);
          const image = Buffer.from(base64, 'base64');
          // const base64String = `data:image/png;base64,${image}`; // Not a real image
          // // Remove header
          // const base64Image = base64String.split(';base64,').pop();
          // fs.writeFile(
          //   'image.png',
          //   base64Image,
          //   { encoding: 'base64' },
          //   function (err) {
          //     console.log('File created');
          //   },
          // );

          if (image) {
            await bot.sendPhoto(query.message?.chat?.id, image);
          }
        } catch (error) {
          console.log('error :>> ', error);
        }
        // console.log('img :>> ', img);
        // await bot.sendPhoto(query.message?.chat?.id, img);
      }
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
  }
}
