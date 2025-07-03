import { IsNumberString, IsOptional } from 'class-validator';

export class GetTasksQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
