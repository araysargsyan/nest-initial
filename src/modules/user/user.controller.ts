import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('user')
export class UserController {
    constructor(private usersService: UserService) {}

    @Get('/')
    //@Redirect('https://docs.nestjs.com', 302)
    async findAll() {
        return await this.usersService.findAll();
    }

    //@UseFilters(HttpExceptionFilter)

    @Post('/')
    async create(@Body() userDto: CreateUserDto) {
        console.log(userDto, 'controller');
        //try {
        return await this.usersService.createUser(userDto);
        // } catch (e) {
        //   throw new ForbiddenException();
        // }
    }
}
