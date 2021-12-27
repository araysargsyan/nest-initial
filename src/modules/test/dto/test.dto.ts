import { IsNotEmpty, IsString } from 'class-validator';
import { TestEntity } from '../test.entity';
import { UploadTestDto } from '@/modules/test/dto/upload-test.dto';

export class TestDto extends UploadTestDto implements Partial<TestEntity> {
    @IsString()
    @IsNotEmpty()
    name: string;
}
