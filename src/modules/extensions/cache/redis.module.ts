import { Global, Module } from '@nestjs/common';
import { REDIS } from '@/common/constants/global.const';
import { createClient } from 'redis';

// @Global()
// @Module({
//     providers: [
//         {
//             provide: REDIS,
//             useValue: createClient({
//                 url: 'redis://alice:foobared@awesome.redis.server:6379',
//                 //legacyMode: true,
//             }),
//         },
//     ],
//     exports: [REDIS],
// })
// export class RedisModule {}
