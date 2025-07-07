import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: {
    id: string;
    email: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this._generateToken(
      payload,
      'JWT_ACCESS_TOKEN_EXPIRES_IN',
    );
    const refreshToken = await this._generateToken(
      payload,
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    );
    return { accessToken, refreshToken };
  }

  private async _generateToken(
    payload: { id: string; email: string },
    expiresInKey: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>(expiresInKey),
    });
  }
}
