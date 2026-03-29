import { StorageService } from '@/modules/storage/application/storage.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '@/modules/file/domain/file.repository.interface';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly _repo: IFileRepository,
    private readonly _storage: StorageService,
  ) {}

  async uploadFile(
    buffer: Buffer,
    originalFileName: string,
    userId: string,
    isPublic = false,
  ): Promise<{ fileId: string; fileKey: string }> {
    this.logger.log(
      `Upload file started | userId=${userId} originalFileName=${originalFileName} isPublic=${isPublic}`,
    );

    const fileKey = await this._storage.uploadPdf(
      buffer,
      originalFileName,
      userId,
    );

    this.logger.log(`File uploaded to storage | fileKey=${fileKey}`);

    const file = await this._repo.create({
      fileKey,
      originalFileName,
      isPublic,
    });

    this.logger.log(
      `File metadata saved | fileId=${file.id} fileKey=${file.fileKey}`,
    );

    return {
      fileId: file.id,
      fileKey: file.fileKey,
    };
  }

  async getSignedUrl(fileId: string): Promise<string> {
    this.logger.log(`Get signed URL started | fileId=${fileId}`);

    try {
      const file = await this._repo.findById(fileId);

      if (!file) {
        this.logger.warn(`File not found | fileId=${fileId}`);
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(
        `Generating signed URL | fileId=${file.id} fileKey=${file.fileKey}`,
      );

      const { url } = await this._storage.getSingedUrl(file.fileKey);

      this.logger.log(`Signed URL generated | fileId=${file.id}`);

      return url;
    } catch (error) {
      this.logger.error(
        `Failed to get signed URL | fileId=${fileId}`,
        error.stack,
      );
      throw error instanceof HttpException
        ? error
        : new HttpException(
            `Failed to get signed URL | fileId=${fileId}`,
            HttpStatus.BAD_GATEWAY,
          );
    }
  }

  async getFileKey(fileId: string): Promise<string> {
    this.logger.log(`Get file key started | fileId=${fileId}`);

    try {
      const file = await this._repo.findById(fileId);

      if (!file) {
        this.logger.warn(`File not found | fileId=${fileId}`);
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(
        `File key resolved | fileId=${fileId} fileKey=${file.fileKey}`,
      );

      return file.fileKey;
    } catch (error) {
      this.logger.error(
        `Failed to get file key | fileId=${fileId}`,
        error.stack,
      );
      throw error instanceof HttpException
        ? error
        : new HttpException(
            `Failed to get file key | fileId=${fileId}`,
            HttpStatus.BAD_GATEWAY,
          );
    }
  }
}
