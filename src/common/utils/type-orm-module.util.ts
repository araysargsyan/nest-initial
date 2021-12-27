import { TypeOrmModule as TypeOrmModuleInitial } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Connection, ConnectionOptions } from 'typeorm';
import { DynamicModule } from '@nestjs/common';

export function TypeOrmModuleMultiForFeature(entities?: EntityClassOrSchema[], connections?: Connection[] | ConnectionOptions[] | string[]): DynamicModule[] {
    return connections.map((connection) => TypeOrmModuleInitial.forFeature(entities, connection));
}
