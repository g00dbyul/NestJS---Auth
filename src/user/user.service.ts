import {ForbiddenException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from "./entities/create.user.dto";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import {bcryptConstant} from "../constants";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto) {
        const isExist = await this.userRepository.findOne({userId:createUserDto.userId});
        if (isExist) {
            throw new ForbiddenException({
                statusCode: HttpStatus.FORBIDDEN,
                message: [`Already exist user`],
                error: 'Forbidden'
            })
        }
        createUserDto.password = await bcrypt.hash(createUserDto.password, bcryptConstant.saltOrRound)
        const { password, ...result } = await this.userRepository.save(createUserDto);
        return result
    }
    async findAll(): Promise<User[]> {
        return await this.userRepository.find({select:["seq","userId","userName","role"]})
    }
    async findOne(id:string): Promise<User> {
        return this.userRepository.findOne({userId:id},
            {select:["seq", "userId", "userName", "role"]})
    }
}
