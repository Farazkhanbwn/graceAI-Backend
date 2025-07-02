import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './api/auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [DatabaseModule, SubscriptionModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
