import { Factory, Seeder, useRefreshDatabase } from 'typeorm-seeding';
import { TestEntity } from '../../modules/test/test.entity';
import { Connection } from 'typeorm';
import { UserEntity } from '../../modules/user/user.entity';

export class CreateAplo implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        console.log(77777);

        await factory(TestEntity)().create();

        await connection
            .createQueryBuilder()
            .insert()
            .into(TestEntity)
            .values([{ name: 'Asdas' }])
            .execute();
    }
}
