export interface IEnvSchema {
  NODE_ENV: string;
  PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  GLOBAL_API_PREFIX: string;
  JWT_SECRET_KEY: string;
  JWT_TOKEN_EXPIRATION: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_KEY: string;
  AWS_REGION: string;
  AWS_ACCESS_URL: string;
  AWS_S3_BUCKET_NAME: string;
  CF_KEY_PAIR_ID: string;
  EXTERNAL_API_URL?: string;
}
