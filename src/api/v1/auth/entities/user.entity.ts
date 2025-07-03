import { BaseEntity } from 'src/shared/base.entity';
import { Entity, Column } from 'typeorm';

@Entity({ schema: 'grace-ai', name: 'users' })
export class User extends BaseEntity {
  @Column({ nullable: true })
  name?: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
