/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly maxRetries = 5;
  private readonly retryDelay = 5000; // 5 seconds
  private readonly maxConnectionAttempts = 3;

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase() {
    let retries = 0;
    let connectionAttempts = 0;

    while (
      retries < this.maxRetries &&
      connectionAttempts < this.maxConnectionAttempts
    ) {
      try {
        if (this.dataSource.isInitialized) {
          this.logger.log('✅ Database connected successfully!');
          await this.ensureSchemaExists();
          return;
        }

        await this.dataSource.initialize();
        this.logger.log('✅ Database connected successfully!');
        await this.ensureSchemaExists();
        return;
      } catch (error) {
        connectionAttempts++;
        this.logger.error(
          `❌ Database connection attempt ${connectionAttempts} failed: ${error.message}`,
        );

        if (error.message.includes('remaining connection slots are reserved')) {
          // If we hit the connection limit, wait longer before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, this.retryDelay * 2),
          );
          retries++;
        } else if (connectionAttempts >= this.maxConnectionAttempts) {
          this.logger.error(
            '❌ Max connection attempts reached. Could not connect to database.',
          );
          throw error;
        }

        this.logger.log(`Retrying in ${this.retryDelay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      }
    }

    if (retries >= this.maxRetries) {
      this.logger.error(
        '❌ Max retries reached. Could not connect to database.',
      );
      throw new Error('Failed to connect to database after maximum retries');
    }
  }

  private async ensureSchemaExists() {
    try {
      // Add any schema initialization logic here if needed
      await this.dataSource.query('SELECT 1');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error ensuring schema exists: ${errorMessage}`);
      throw error;
    }
  }
}

