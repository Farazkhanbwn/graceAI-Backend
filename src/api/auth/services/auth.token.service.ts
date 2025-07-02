/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config';
import { IAuthenticatedUserPayload } from '../types/auth.type';

@Injectable()
export class AuthTokenService {
  constructor(private readonly configService: ConfigService) {}

  verify(token: string): Promise<IAuthenticatedUserPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.configService.getJWTSecretKey(),
        (err, decoded) => {
          if (err) {
            return reject(err);
          }
          return resolve(decoded as IAuthenticatedUserPayload);
        },
      );
    });
  }

  sign(payload: IAuthenticatedUserPayload) {
    return jwt.sign(payload, this.configService.getJWTSecretKey());
  }
}
