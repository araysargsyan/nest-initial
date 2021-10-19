import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProvidersDto } from './dto/createUser.dto';
import { TablesEnum } from '@common/enums/tables.enum';

@Entity(TablesEnum.USERS)
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    lastName: string;

    @Column({
        nullable: false,
    })
    firstName: string;

    @Column({
        length: 300,
        unique: true,
        nullable: false,
    })
    email: string;

    @Column({
        length: 300,
        nullable: true,
    })
    password: string;

    // @Column({
    //     //name: 'type',
    //     type: 'enum',
    //     enum: AuthEnum,
    //     array: true,
    //     nullable: true,
    // })
    // providers: AuthEnum[];

    @Column({
        //name: 'type',
        type: 'json',
        //enum: AuthEnum,
        //array: true,
        nullable: true,
    })
    providers: UserProvidersDto;

    @Column({
        default: false,
    })
    banned: boolean;

    @Column({
        length: 300,
        nullable: true,
    })
    banReason: string;
}
