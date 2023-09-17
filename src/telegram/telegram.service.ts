import { Injectable } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import {
  InjectBot,
  Start,
  Update,
  Action,
  Ctx,
  Hears,
  On,
  Message,
} from 'nestjs-telegraf';

import { Scenes, Telegraf } from 'telegraf';
import { actionButtons, actionButtons2 } from './telegram.buttons';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

// import { SceneContext } from 'telegraf/typings/scenes';
// import { Update } from 'telegraf/typings/core/types/typegram';
// import { AppService } from './app.service';
// import { actionButtons, actionButtons2 } from './app.buttons';
// import { Context } from './context.interface';
// import { UserService } from './user/user.service';
// import { CreateUserDto } from './user/dto/create-user.dto';

// import { Context as ContextTelegraf } from 'telegraf';

// export interface Context extends ContextTelegraf {
//   session: {
//     type: 'new' | 'repeat' | 'game';
//   };
// }

type Context = Scenes.SceneContext;

const commands = [
  {
    command: 'start',
    description: 'Запуск бота',
  },
  {
    command: 'ref',
    description: 'Получить реферальную ссылку',
  },
  {
    command: 'help',
    description: 'Раздел помощи',
  },
];

@Update()
export class TelegramService extends Telegraf<Context> {
  constructor(
    //   @InjectBot() private readonly bot: Telegraf<Context>,
    // private telegramService: TelegramService,
    //   private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super(configService.get('TELEGRAM_API_TOKEN'));
  }

  @Start()
  // getBotDialog(@Res() res) {
  //   this.telegramService.botMessage();
  //   res.status(HttpStatus.OK).send('Bot service started');
  // }
  async startCommand(@Ctx() ctx: Context) {
    console.log('START:>> ', ctx);
    console.log('START from:>> ', ctx.message.from);
    console.log('START chat:>> ', ctx.message.chat);
    // ctx.deleteMessage();
    ctx.telegram.setMyCommands(commands);
    const message = await this.userService.create(
      ctx.message.from as CreateUserDto,
    );
    await ctx.reply(`${message}\nЧто ты хочешь сделать?`, actionButtons());
  }

  @Action('list')
  async getAll(@Ctx() ctx: Context) {
    console.log('context :>> ', ctx);
    return 'List Words';
  }

  @Hears('📖 Показать список выученных слов')
  async hearsList(@Ctx() ctx: Context) {
    ctx.deleteMessage();
    // console.log('ctx :>> ', ctx.);
    await ctx.reply('Hey there');
  }

  @Hears('📝 Выучить новое слово')
  async hearsNewWord(@Ctx() ctx: Context) {
    // ctx.session.type = 'new';
    await ctx.reply('Твоё новое слово You', actionButtons2());
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    // if (!ctx.session.type) return;
    console.log('message :>> ', message);
    // if (ctx.session.type === 'new') {
    if (message !== 'You') {
      console.log('ctx :>> ', ctx);
      // ctx.deleteMessage();
      // const res = await ctx.reply(
      //   'Напиши новое слово которое ты хочешь выучить',
      // );
      // console.log('res :>> ', res);
      // ctx.telegram.editMessageText(
      //   ctx.chat.id,
      //   ctx.message.message_id,
      //   ctx.message.message_id.toString(),
      //   'TEST',
      // );
      // ctx.telegram.editMessageText(
      //   res.chat.id,
      //   res.message_id,
      //   undefined,
      //   'такой текс не найден',
      // );
      // await ctx.edit;
      //   }
    }
  }
}
