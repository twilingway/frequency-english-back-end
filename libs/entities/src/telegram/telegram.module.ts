import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { StableModule } from 'src/stable/stable.module';
import { YandexModule } from 'src/yandex/yandex.module';

@Module({
  imports: [StableModule, YandexModule],
  providers: [TelegramService],
})
export class TelegramModule {}
