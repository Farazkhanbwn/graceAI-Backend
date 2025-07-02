import { Entity, Column, BaseEntity } from 'typeorm';

@Entity({ schema: 'grace', name: 'subscription' })
export class SubscriptionEntity extends BaseEntity {
  @Column({ type: 'integer' })
  recipientId: number;

  @Column({ type: 'string' })
  userId: string;

  @Column({ nullable: true, type: 'jsonb' })
  data?: any;
}
