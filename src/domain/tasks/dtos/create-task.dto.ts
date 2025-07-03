import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TaskStatus } from 'src/common/enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Design form ui create task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Description design form ui create task' })
  @IsString()
  description: string;

  @ApiProperty({ example: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  priority: number;
}
