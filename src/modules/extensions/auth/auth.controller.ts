import { Body, CACHE_MANAGER, Controller, ExecutionContext, Get, Inject, Injectable, Logger, Post, Query, Res, Session, UseGuards } from '@nestjs/common';
import { EndPointsEnum } from '@/common/enums/end-points.enum';
import { AuthService } from '@/modules/extensions/auth/auth.service';
import { UserCreateDto } from '@/modules/user/dto/user.create.dto';
import { SignInDto } from '@/modules/extensions/auth/dto/sign-in.dto';
import { SignInResponseDto } from '@/modules/extensions/auth/dto/sign-in.response.dto';
import { SignUpResponseDto } from '@/modules/extensions/auth/dto/sign-up.response.dto';
import { User } from '@/common/decorators/request-user.decorator';
import { Response } from 'express';
import { SocialAuthType } from '@/common/decorators/social-auth-type.decorator';
import { TSocialAuthType } from '@/common/types/core';
import { SocialAuthTypeEnum } from '@/common/interfaces/social-auth-type.enum';
import { SocialAuthEnum } from '@/common/enums/auth.enum';
import { SocialUser } from '@/modules/extensions/auth/dto/social-user.dto';
import { UserFromToken } from '@/modules/extensions/auth/dto/user-from-token.dto';
import { UseSocialAuthGuard } from '@/common/decorators/social-auth-guard.decorator';
import { getPathFromEnum } from '@/common/helpers/get-path-from-enum';
import { LocalGuard, LoggedInGuard, LoginLocalGuard } from '@/core/guards/local-auth.guard';

@Controller(EndPointsEnum.AUTH)
export class AuthController {
    static readonly strategyPath = getPathFromEnum(SocialAuthEnum);
    static readonly socialAuthTypePath = getPathFromEnum(SocialAuthTypeEnum);

    constructor(private authService: AuthService) {}

    //! STANDART
    @Post('/sign-up')
    signUp(@Body() createUserDto: UserCreateDto): Promise<SignUpResponseDto> {
        return this.authService.signUp(createUserDto);
    }
    @Post('/sign-in')
    async signIn(@Body() loginUserDto: SignInDto): Promise<SignInResponseDto> {
        return await this.authService.signIn(loginUserDto);
    }

    //! SOCIAL AUTH
    @Get(`:type(${AuthController.socialAuthTypePath})/:strategy(${AuthController.strategyPath})`)
    @UseSocialAuthGuard()
    async socialAuth() {
        Logger.log('socialAuth');
    }

    @Get(`/:strategy(${AuthController.strategyPath})/redirect`)
    @UseSocialAuthGuard()
    async socialAuthRedirect(
        @Res() response: Response,
        @User() user: SocialUser,
        @SocialAuthType() socialAuthType: TSocialAuthType,
        @Session() session: Record<string, any>,
    ): Promise<any> {
        Logger.log(socialAuthType, 'facebookAuthRedirect');

        if (socialAuthType === SocialAuthTypeEnum.SIGN_IN) {
        } else if (socialAuthType === SocialAuthTypeEnum.SIGN_UP) {
            await this.authService.socialSignUpRedirect(user, response, session);
        }
    }

    @Get('social/sign-up')
    @UseGuards(LoginLocalGuard)
    socialSignUpPage(@Query('user-token') { user }: UserFromToken): Promise<SocialUser> {
        console.log(user, 87987987987);
        return this.authService.socialSignUpPage(user);
    }
    @Post('social/sign-up')
    @UseGuards(LoggedInGuard)
    socialSignUp(@Body() user: SocialUser, @User() userr: any): Promise<SignUpResponseDto> {
        console.log(user, userr);

        return this.authService.signUp(user);
    }
}
