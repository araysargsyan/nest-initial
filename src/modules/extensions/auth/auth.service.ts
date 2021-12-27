import { UserService } from '@/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '@/modules/user/dto/createUser.dto';
import { SingInResponseDto } from './dto/sing-in.response.dto';
import { JwtPayloadInterface } from '@/common/interfaces/jwt-payload.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SingInDto } from '@/modules/extensions/auth/dto/sing-in.dto';
import * as bcrypt from 'bcrypt';
import { SingUpResponseDto } from '@/modules/extensions/auth/dto/sing-up.response.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        //private mailService: MailService,
        private configService: ConfigService,
    ) {}

    async singUp(createUserDto: CreateUserDto): Promise<SingUpResponseDto> {
        const user = await this.userService.create(createUserDto);
        const accessToken = await this.createToken({ id: user.id, email: user.email });

        return { accessToken, user };
    }

    // async socialAuth(res: Response, createSocialUserDto: CreateSocialUserDto): Promise<void> {
    //     try {
    //         const user = await this.userService.authSocialUser(createSocialUserDto);
    //         const accessToken: string = this.createToken({ id: user.id, email: user.email, role: user.role });
    //         return res.redirect(`//${this.configService.get('PUBLIC_URL')}social-login/?tkn=${accessToken}`); //? Changeable
    //     } catch (err) {
    //         return res.redirect(`//${this.configService.get('PUBLIC_URL')}social-login/?error=${err}`); //? Changeable
    //     }
    // }

    async singIn(loginUserDto: SingInDto): Promise<SingInResponseDto> {
        const { email, password } = loginUserDto;
        const user = await this.userService.get({ email });

        if (user && password && user.password && (await compare(password, user.password))) {
            const accessToken = await this.createToken({ id: user.id, email });

            return { accessToken, user };
        }

        throw new BadRequestException('The email address or password is incorrect.');
    }

    private async createToken(payload: JwtPayloadInterface): Promise<string> {
        return this.jwtService.sign(payload);
    }
}
