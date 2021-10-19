import { IsNotEmpty, IsString } from 'class-validator';
import { ApeEntity } from './ape.entity';

export class ApeDto implements Partial<ApeEntity> {
    @IsString()
    @IsNotEmpty()
    name: string;
}
