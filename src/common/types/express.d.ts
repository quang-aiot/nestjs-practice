import 'express';

declare module 'express' {
  export interface Request {
    fileValidationError?: string;
  }
}
