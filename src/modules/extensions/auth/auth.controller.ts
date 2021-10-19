import { Controller, Get, UseGuards, HttpStatus, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { EndPointsEnum } from '@common/enums/end-points.enum';

@Controller(EndPointsEnum.AUTH)
export class AuthController {
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
