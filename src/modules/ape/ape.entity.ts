import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TablesEnum } from '@common/enums/tables.enum';

@Entity(TablesEnum.APES)
export class ApeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
