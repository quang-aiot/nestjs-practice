import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { extname } from 'path';

export function imageFileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) {
  const allowedExt = ['.jpg', '.jpeg', '.png'];
  const ext = extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    req.fileValidationError = ` File extension must be: ${allowedExt.join(', ')}`;
    return cb(null, false);
  }

  const fileSize = parseInt(req.headers['content-length'] || '0', 10);
  if (fileSize > 5 * 1024 * 1024) {
    req.fileValidationError = 'File size exceeds 5MB';
    return cb(null, false);
  }

  cb(null, true);
}
