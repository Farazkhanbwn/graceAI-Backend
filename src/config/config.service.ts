/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import * as fs from 'fs';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm/data-source';
import { DeploymentEnvironmentTypes } from 'src/shared/enums/environment.type';
import { IEnvSchema } from 'src/shared/interfaces/env-schema.interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig: IEnvSchema;

  constructor() {
    this.loadCustomEnv();
    const config: { [key: string]: string } = Object.keys(process.env).reduce(
      (acc, key) => {
        const value = process.env[key];
        if (typeof value === 'string') {
          acc[key] = value;
        }
        return acc;
      },
      {} as { [key: string]: string },
    );
    this.envConfig = this.validateEnvSchema(config);
  }

  private loadCustomEnv() {
    // If Node.js doesn't automatically load from a custom folder, manually read it
    const envPath = path.resolve(`.env`);
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf8');
      envFile.split('\n').forEach((line) => {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });
    }
  }

  private getEnvSchema() {
    const schema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(...Object.values(DeploymentEnvironmentTypes))
        .default(DeploymentEnvironmentTypes.Development),
      PORT: Joi.number().integer().positive().min(1001).max(9999).required(),
      DB_USERNAME: Joi.string().trim().min(1).required(),
      DB_PASSWORD: Joi.string().trim().min(1).required(),
      DB_NAME: Joi.string().trim().min(1).required(),
      DB_HOST: Joi.string().trim().min(1).required(),
      DB_PORT: Joi.number().integer().positive().min(1001).max(9999).required(),
      GLOBAL_API_PREFIX: Joi.string()
        .trim()
        .regex(/v([1-9]+)/)
        .required(),
    });

    return schema;
  }

  private validateEnvSchema(keyValuePairs) {
    const envSchema = this.getEnvSchema();
    const validationResult = envSchema.validate(keyValuePairs, {
      allowUnknown: true,
    });

    if (validationResult.error) {
      throw new Error(
        `Validation failed for .env file. ${validationResult.error.message}`,
      );
    }

    return validationResult.value;
  }

  private get(key: string): string {
    return this.envConfig[key];
  }

  getEnvironment(): string {
    return this.get('NODE_ENV');
  }

  getPort(): string {
    return this.get('PORT');
  }

  getDBUsername(): string {
    return this.get('DB_USERNAME');
  }

  getDBPassword(): string {
    return this.get('DB_PASSWORD');
  }

  getDBName(): string {
    return this.get('DB_NAME');
  }

  getDBHost(): string {
    return this.get('DB_HOST');
  }

  getDBPort(): string {
    return this.get('DB_PORT');
  }

  getGlobalAPIPrefix(): string {
    return this.get('GLOBAL_API_PREFIX');
  }

  getTypeOrmConfig(): DataSourceOptions {
    const baseConfig: DataSourceOptions = {
      type: 'postgres',
      username: this.getDBUsername(),
      password: this.getDBPassword(),
      database: this.getDBName(),
      host: this.getDBHost(),
      synchronize: false,
      port: parseInt(this.getDBPort()),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: ['dist/database/migrations/*{.ts,.js}'],
      subscribers: ['dist/**/*.subscriber{.ts,.js}'],
      extra: {
        max: 10,
        min: 2,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000,
        statement_timeout: 30000,
        query_timeout: 30000,
        application_name: 'noair-lab-backend',
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
      },
      poolSize: 10,
      connectTimeoutMS: 30000,
    };

    return (this.getEnvironment() as DeploymentEnvironmentTypes) ===
      DeploymentEnvironmentTypes.Production
      ? {
          ...baseConfig,
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : baseConfig;
  }
}

