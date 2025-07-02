// src/users/entities/user.entity.ts
import { BaseEntity } from 'src/shared/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('users')
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
