import { Factory, Seeder, useRefreshDatabase } from 'typeorm-seeding';
import { ApeEntity } from '../../modules/ape/ape.entity';
import { Connection } from 'typeorm';
import { UserEntity } from '../../modules/user/user.entity';

export class CreateApe implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        console.log(55555, connection);
        await factory(ApeEntity)().create();

        await connection
            .createQueryBuilder()
            .insert()
            .into(ApeEntity)
            .values([{ name: 'Asdas' }])
            .execute();
    }
}
