import {ForbiddenException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
       @InjectRepository(User)
       private userRepository: Repository<User>,
       private jwtService: JwtService
    ) {}

    async login(user) {
        const payload = { userId: user.userId, userName: user.userName, seq: user.seq, role: user.role }
        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
    async validateUser(loginUserDto):Promise<any> {
        const user = await this.userRepository.findOne({userId:loginUserDto.userId});
        if(!user) {
            throw new ForbiddenException({
                statusCode: HttpStatus.FORBIDDEN,
                message: [`등록되지 않은 사용자입니다.`],
                error: 'Forbidden'
            })
        }
        const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
        if(isMatch) {
            const { password, ...result } = user;
            return result;
        } else {
            throw new ForbiddenException({
                statusCode: HttpStatus.FORBIDDEN,
                message: [`사용자 정보가 일치하지 않습니다.`],
                error: 'Forbidden'
            })
        }
    }
}
