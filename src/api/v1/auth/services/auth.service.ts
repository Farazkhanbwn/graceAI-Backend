/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login-dto';
import { AuthTokenService } from './auth.token.service';
import { HashService } from 'src/shared/services/hash/hash.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { normalizeEmail } from 'src/shared/utils/utils';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authTokenService: AuthTokenService,
    private readonly hashService: HashService,
  ) {}

  async signup(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashService.hashPassword(dto.password);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...rest } = savedUser;
    return rest;
  }

  async login(
    dto: LoginDto,
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.isPasswordValid(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...rest } = user;

    // 🔐 Create token using user id and username
    const token = this.authTokenService.sign({
      id: user.id,
      username: user.username,
    });

    return { user: rest, token };
  }

  async isPasswordValid(plainPassword: string, hashedPassword: string) {
    return await this.hashService.check(plainPassword, hashedPassword);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = normalizeEmail(dto.email);

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('No user found with this email address');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // TODO: Send OTP via email in production
    return { message: 'Password reset instructions sent', token: otp };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const email = normalizeEmail(dto.email);

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new BadRequestException('No user found with this email address');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    const hashedPassword = await this.hashService.hashPassword(dto.newPassword);
    await this.userRepository.update(user.id, { password: hashedPassword });

    return { message: 'Password has been reset successfully' };
  }
}
