export const FILE_REPOSITORY = Symbol('FILE_REPOSITORY');
export interface IFileRepository {
  create(data: {
    fileKey: string;
    originalFileName: string;
    isPublic: boolean;
  }): Promise<{
    id: string;
    fileKey: string;
    originalFileName: string;
    isPublic: boolean;
    uploadedAt: Date;
  }>;

  findById(id: string): Promise<{
    id: string;
    fileKey: string;
    originalFileName: string;
    isPublic: boolean;
    uploadedAt: Date;
  } | null>;
}
