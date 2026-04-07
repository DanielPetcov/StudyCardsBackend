import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  private readonly s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_S3_API_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY!,
      secretAccessKey: process.env.R2_SECRET_KEY!,
    },
  });

  async uploadPdf(
    file: Buffer,
    filename: string,
    userId: string,
  ): Promise<string> {
    const key = `users/${userId}/file/${randomUUID()}-${filename}`;

    this.logger.log(
      `Upload file started | userId=${userId} fileName=${filename} key=${key} size=${file.length}`,
    );

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: key,
          Body: file,
        }),
      );

      this.logger.log(`Upload file completed | userId=${userId} key=${key}`);

      return key;
    } catch (error) {
      this.logger.error(
        `Upload file failed | userId=${userId} fileName=${filename} key=${key}`,
        error.stack,
      );
      throw error;
    }
  }

  async getSignedUrl(
    fileKey: string,
  ): Promise<{ url: string; expirationTime: number }> {
    const expirationTime = 3600;

    this.logger.log(`Generate signed URL started | fileKey=${fileKey}`);

    try {
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: fileKey,
      });

      const url = await getSignedUrl(this.s3, command, {
        expiresIn: expirationTime,
      });

      this.logger.log(
        `Generate signed URL completed | fileKey=${fileKey} expiresIn=${expirationTime}`,
      );

      return { url, expirationTime };
    } catch (error) {
      this.logger.error(
        `Generate signed URL failed | fileKey=${fileKey}`,
        error.stack,
      );
      throw error;
    }
  }
}
