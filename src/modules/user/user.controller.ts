import { Body, Controller, ForbiddenException, Get, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const validateFileType = (extt) => {
    return (req, file, callback) => {
        console.log(req, file, extt, 999);
        const ext = extname(file.originalname);
        if (ext !== extt) {
            req.fileValidationError = 'Invalid file type';
            return callback(new Error('Invalid file type'), false);
        }
        return callback(null, true);
    };
};

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
