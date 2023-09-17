import { ConfigService } from '@nestjs/config';
import {
  TelegrafModuleAsyncOptions,
  TelegrafModuleOptions,
} from 'nestjs-telegraf';
// import LocalSession from 'telegraf-session-local';

// const sessions = new LocalSession({ database: 'session_db.json' });

const telegrafModuleOptions = (
  configService: ConfigService,
): TelegrafModuleOptions => {
  return {
    token: configService.get('TELEGRAM_API_TOKEN'),
    // middlewares: [sessions.middleware()],
    launchOptions: {
      webhook: {
        domain: 'https://frequency-english-bot.twiling.ru',
        hookPath: '/bot',
      },
    },
  };
};

export const options = (): TelegrafModuleAsyncOptions => {
  return {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      telegrafModuleOptions(configService),
  };
};
