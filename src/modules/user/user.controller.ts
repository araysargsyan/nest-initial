import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { EndPointsEnum } from '@/common/enums/end-points.enum';
import { ResponseInterceptor } from '@/core/interceptors/response.interceptor';
import { UserResponseDto } from '@/modules/user/dto/user.response.dto';
import { UserEntity } from '@/modules/user/user.entity';
import { User } from '@/common/decorators/request-user.decorator';
import { JwtAuthGuard } from '@/core/guards/jwt-auth.guard';
import { JwtPayloadInterface } from '@/common/interfaces/jwt-payload.interface';

@Controller(EndPointsEnum.USER)
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/')
    //@UseInterceptors(new ResponseInterceptor(UserResponseDto))
    async getUser(@User() user: JwtPayloadInterface): Promise<UserEntity> {
        return await this.userService.get({ id: user.id });
    }

    @Get('/all')
    //@Redirect('https://docs.nestjs.com', 302)
    async findAll() {
        console.log('findAll');
        return await this.userService.findAll();
    }

    //@UseFilters(HttpExceptionFilter)
}
