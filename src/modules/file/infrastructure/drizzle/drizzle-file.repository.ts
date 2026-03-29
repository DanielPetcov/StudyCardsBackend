import { DatabaseService } from '@/modules/database/database.service';
import { IFileRepository } from '@/modules/file/domain/file.repository.interface';

import { file } from '@/modules/database/schemas';

import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleFileRepository implements IFileRepository {
  constructor(private readonly _db: DatabaseService) {}

  async create(data: {
    fileKey: string;
    originalFileName: string;
    isPublic: boolean;
  }) {
    const [newFile] = await this._db.db.insert(file).values(data).returning();
    return newFile;
  }

  async findById(id: string) {
    const [result] = await this._db.db
      .select()
      .from(file)
      .where(eq(file.id, id));

    return result || null;
  }
}
