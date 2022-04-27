import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./entities/create.user.dto";
import {Role} from "../auth/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {User} from "./entities/user.entity";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<any> {
        return this.userService.create(createUserDto)
    }
    @Get()
    @Role("admin")
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    findAll():Promise<User[]> {
        return this.userService.findAll();
    }

}
