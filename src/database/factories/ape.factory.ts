import * as Faker from 'faker';
import { TestEntity } from '../../modules/test/test.entity';
import { define } from 'typeorm-seeding';

define(TestEntity, (faker: typeof Faker) => {
    console.log('faker');
    const ape = new TestEntity();
    const name = `${faker.random.word()} Team`;
    ape.name = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    console.log(ape);
    return ape;
});
