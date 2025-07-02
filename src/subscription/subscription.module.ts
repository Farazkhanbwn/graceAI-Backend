import { Module } from '@nestjs/common';
import { SubscriptionController } from './controllers/subscription/subscription.controller';
import { SubscriptionService } from './services/subscription/subscription.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
