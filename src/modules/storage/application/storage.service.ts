import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  async uploadPdf(file: Buffer, filename: string): Promise<string> {
    return '';
  }
  async getSingedUrl(path: string): Promise<string> {
    return '';
  }
}
