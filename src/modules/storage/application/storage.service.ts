import { Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
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

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: file,
      }),
    );

    return key;
  }
  async getSingedUrl(
    fileKey: string,
  ): Promise<{ url: string; expirationTime: number }> {
    const expirationTime = 3600;

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: fileKey,
    });

    const getUrl = await getSignedUrl(this.s3, command, {
      expiresIn: expirationTime,
    });

    return { url: getUrl, expirationTime };
  }
}
