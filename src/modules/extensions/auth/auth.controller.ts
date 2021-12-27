import { Controller, Get, UseGuards, HttpStatus, Req, Body, Post, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { EndPointsEnum } from '@/common/enums/end-points.enum';
import { AuthService } from '@/modules/extensions/auth/auth.service';
import { CreateUserDto } from '@/modules/user/dto/createUser.dto';
import { SingInDto } from '@/modules/extensions/auth/dto/sing-in.dto';
import { SingInResponseDto } from '@/modules/extensions/auth/dto/sing-in.response.dto';
import { SingUpResponseDto } from '@/modules/extensions/auth/dto/sing-up.response.dto';
import { ResponseInterceptor } from '@/core/interceptors/response.interceptor';

@Controller(EndPointsEnum.AUTH)
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/sing-up')
    // @UseInterceptors(UploadFilesInterceptor('image', 6, FileUploadFolderEnum.PROFILE, [FileTypes.PNG, FileTypes.JPEG, FileTypes.JPG, FileTypes.TXT]))
    @UseInterceptors(new ResponseInterceptor(SingUpResponseDto))
    async singUp(@Body() createUserDto: CreateUserDto): Promise<SingUpResponseDto> {
        return await this.authService.singUp(createUserDto);
    }

    @Post('/sing-in')
    @UseInterceptors(new ResponseInterceptor(SingInResponseDto))
    async singIn(@Body() loginUserDto: SingInDto): Promise<SingInResponseDto> {
        return await this.authService.singIn(loginUserDto);
    }

    @Get('/facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookLogin() {}

    @Get('/facebook/redirect')
    @UseGuards(AuthGuard('facebook'))
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: req.user,
        };
    }
}
