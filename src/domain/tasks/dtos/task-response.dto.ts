import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] })
  status: string;

  @ApiProperty()
  priority: number;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
