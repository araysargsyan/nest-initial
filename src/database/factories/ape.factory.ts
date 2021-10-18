import * as Faker from 'faker';
import { ApeEntity } from '../../modules/ape/ape.entity';
import { define } from 'typeorm-seeding';

define(ApeEntity, (faker: typeof Faker) => {
    console.log('faker');
    const ape = new ApeEntity();
    const name = `${faker.random.word()} Team`;
    ape.name = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    console.log(ape);
    return ape;
});
