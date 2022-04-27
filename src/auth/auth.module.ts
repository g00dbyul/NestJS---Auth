import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import { AuthService } from './auth.service';
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import {jwtConstants} from "../constants";

@Module({
  imports:[
      UserModule,
      PassportModule,
      JwtModule.register({
        secret:jwtConstants.secret,
        signOptions: {}
      }),
      TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers:[AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
