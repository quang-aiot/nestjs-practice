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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new User' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'success',
        data: {
          name: 'Thai Mai Quang',
          email: 'demo@gmail.com',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input or email exists' })
  @Post('/register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto);
  }

  @ApiOperation({ summary: 'login a user' })
  @ApiCreatedResponse({
    description: 'Login user successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
          refreshToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or email and password is incorrect',
  })
  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }
}
