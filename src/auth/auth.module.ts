import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
@Module({
  imports:[
    UserModule,
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
}
