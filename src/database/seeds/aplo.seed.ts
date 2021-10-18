import { Factory, Seeder, useRefreshDatabase } from 'typeorm-seeding';
import { ApeEntity } from '../../modules/ape/ape.entity';
import { Connection } from 'typeorm';
import { UserEntity } from '../../modules/user/user.entity';

export class CreateAplo implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        console.log(77777);

        await factory(ApeEntity)().create();

        await connection
            .createQueryBuilder()
            .insert()
            .into(ApeEntity)
            .values([{ name: 'Asdas' }])
            .execute();
    }
}
