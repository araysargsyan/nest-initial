import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TablesEnum } from '@/common/enums/tables.enum';

@Entity(TablesEnum.TESTS)
export class TestEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
