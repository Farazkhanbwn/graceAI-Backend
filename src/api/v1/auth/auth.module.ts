import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthTokenService } from './services/auth.token.service';
import { ConfigService } from 'src/config';
import { HashService } from 'src/shared/services/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, HashService, AuthTokenService],
  exports: [AuthService, AuthTokenService], // if you want to use it in other modules later
})
export class AuthModule {}
