import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { options } from './telegram-config.factory';

import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TelegrafModule.forRootAsync(options()), UserModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
