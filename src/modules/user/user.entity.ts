import { BeforeInsert, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TablesEnum } from '@/common/enums/tables.enum';
import { UserProvidersDto } from '@/modules/user/dto/user.create.dto';
import { hash } from 'bcrypt';
import { BaseEntity } from '@/common/utils/base.entity';

@Entity(TablesEnum.USERS)
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ length: 300, unique: true, nullable: false })
    email: string;

    @Column({ length: 64, nullable: true })
    password: string;
    @BeforeInsert()
    async insertPassword?() {
        this.password && (await hash(this.password, 10));
    }

    // @Column({
    //     //name: 'type',
    //     type: 'enum',
    //     enum: AuthEnum,
    //     array: true,
    //     nullable: true,
    // })
    // providers?: AuthEnum[];

    @Column({
        //name: 'type',
        type: 'json',
        //enum: AuthEnum,
        //array: true,
        nullable: true,
    })
    providers?: UserProvidersDto;

    @Column({ default: false })
    banned?: boolean;

    @Column({ length: 300, nullable: true })
    banReason?: string;
}
