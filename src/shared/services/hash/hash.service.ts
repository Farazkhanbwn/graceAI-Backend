import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  static readonly SALT_ROUNDS = 10;

  async check(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, HashService.SALT_ROUNDS);
  }

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, HashService.SALT_ROUNDS);
  }
}
