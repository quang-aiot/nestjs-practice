import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { BcryptHelper } from 'src/lib/bcrypt/bcrypt.helper';
import { LoginUserDto } from './dtos/login-user.dto';
import { TokenService } from './tokens/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<{
    email: string;
    fullName: string;
  }> {
    const userExist = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userExist) {
      throw new ConflictException('Email already exist');
    }
    const hashtedPassword = await BcryptHelper.hash(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashtedPassword,
    });
    const saveUser = await this.userRepository.save(user);

    return {
      email: saveUser.email,
      fullName: saveUser.fullName,
    };
  }

  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (
      !user ||
      !(await BcryptHelper.compare(loginUserDto.password, user.password))
    ) {
      throw new BadRequestException('Email or password is incorrect');
    }
    const accessToken = await this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = await this.tokenService.generateRefreshToken({
      id: user.id,
      email: user.email,
    });
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
