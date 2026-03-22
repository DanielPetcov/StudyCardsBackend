import { Injectable } from '@nestjs/common';
import { db } from './db';

@Injectable()
export class DatabaseService {
  public readonly db = db;
}
