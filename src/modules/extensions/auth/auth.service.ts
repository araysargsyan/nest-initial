import { UserService } from '@/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserCreateDto } from '@/modules/user/dto/user.create.dto';
import { SignInResponseDto } from './dto/sign-in.response.dto';
import { JwtPayloadInterface } from '@/common/interfaces/jwt-payload.interface';
import { BadRequestException, CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from '@/modules/extensions/auth/dto/sign-in.dto';
import { SignUpResponseDto } from '@/modules/extensions/auth/dto/sign-up.response.dto';
import { compare } from 'bcrypt';
import { APP_URL } from '@/common/constants/global.const';
import { EndPointsEnum } from '@/common/enums/end-points.enum';
import { Response } from 'express';
import { CryptoService } from '@/modules/extensions/common/crypto.service';
import { classToPlain, deserialize, plainToClass, serialize } from 'class-transformer';
import { SocialUser } from '@/modules/extensions/auth/dto/social-user.dto';
import { Cache } from 'cache-manager';
import { TSocialAuthType } from '@/common/types/core';
import { isEqual } from 'lodash';
import { CACHE_SOCIAL_USER } from '@/common/constants/auth.const';

@Injectable()
export class AuthService {
    private readonly authRouteBasePath: string = null;

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        //private mailService: MailService,
        private configService: ConfigService,
        private cryptoService: CryptoService, // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        this.authRouteBasePath = `${configService.get(APP_URL)}/${EndPointsEnum.AUTH}`;
    }

    async signUp(createUserDto: UserCreateDto): Promise<SignUpResponseDto> {
        //console.log(await this.cacheManager.get(CACHE_SOCIAL_USER), 'CACHE_SOCIAL_USER');
        const user = await this.userService.create(createUserDto);
        const accessToken = this.authenticate({ id: user.id, email: user.email });

        return { accessToken, user };
    }

    async signIn(loginUserDto: SignInDto): Promise<SignInResponseDto> {
        const { email, password } = loginUserDto;
        const user = await this.userService.get({ email });

        if (user && password && user.password && (await compare(password, user.password))) {
            const accessToken = this.authenticate({ id: user.id, email });

            return plainToClass(SignInResponseDto, { accessToken, user });
        }

        throw new BadRequestException('The email address or password is incorrect.');
    }

    async socialSignUpRedirect(socialUser: SocialUser, response: Response, session: any) {
        const email = Object.values(socialUser.providers)[0].emails[0];
        const user = await this.userService.get({ email }, {}, true);

        if (user) {
        } else {
            //! sign up
            socialUser.email = email;
            const userToken = this.cryptoService.encrypt(socialUser, true);
            session.passport = { user: this.cryptoService.encrypt(socialUser) };
            console.log(session, 'session');

            //await this.cacheManager.set(CACHE_SOCIAL_USER, JSON.stringify(socialUser));

            return response.redirect(HttpStatus.PERMANENT_REDIRECT, `${this.authRouteBasePath}/social/sign-up/?user-token=${userToken}`);
        }
    }

    async socialSignUpPage(user: SocialUser): Promise<SocialUser> {
        const cachedUser = user; //JSON.parse(await this.cacheManager.get(CACHE_SOCIAL_USER));
        console.log(user, 8888);

        return user;
        // if (isEqual(cachedUser, classToPlain(user))) {
        //     //console.log(await this.cacheManager.get(CACHE_SOCIAL_USER), 'CACHE_SOCIAL_USER', userToken);
        //     //const t = this.authenticate({ token: userToken });
        //     //console.log(444444444, t);
        //     return user;
        // } else {
        //     throw new BadRequestException('Invalid social user');
        // }
    }

    private authenticate(payload: JwtPayloadInterface | any): string {
        return this.jwtService.sign(payload); //'authenticate'
    }
}
