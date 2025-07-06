import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
