export class ApiResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
  timeStamp: string;

  constructor(
    success: boolean,
    message: string,
    data?: T,
    error?: string,
    statusCode: number = 200,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.statusCode = statusCode;
    this.timeStamp = new Date().toISOString();
  }
}
