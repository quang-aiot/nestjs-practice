import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterResponseDto } from 'src/domain/auth/dtos/create-user-response.dto';
import { LoginResponseDto } from 'src/domain/auth/dtos/login-user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new User' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input or email exists' })
  @Post('/register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<{
    email: string;
    fullName: string;
  }> {
    return await this.authService.registerUser(createUserDto);
  }

  @ApiOperation({ summary: 'login a user' })
  @ApiCreatedResponse({
    description: 'Login user successfully',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or email and password is incorrect',
  })
  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.loginUser(loginUserDto);
  }
}
