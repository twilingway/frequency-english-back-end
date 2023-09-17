import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { StableService } from './stable.service';

@Module({
  imports: [HttpModule],
  providers: [StableService],
  exports: [StableService],
})
export class StableModule {}
