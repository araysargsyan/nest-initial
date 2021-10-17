import { Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { ModulesContainer } from '@nestjs/core';
import { UsersRepository } from './modules/user/user.repository';

@Injectable({ scope: Scope.REQUEST })
export class MulterConfigService {
    aa() {
        console.log(98237583297534892578);
    }
}
