import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DocumentsDto {
    @IsNotEmpty()
    title: string;

    @ArrayNotEmpty()
    files: Express.Multer.File[];
}

export class UploadTestDto {
    @IsNotEmpty()
    @IsOptional()
    image: Express.Multer.File;

    @ArrayNotEmpty()
    @IsOptional()
    background: Express.Multer.File[];

    @ValidateNested({ each: true })
    @ArrayNotEmpty()
    @Type(() => DocumentsDto)
    documents: DocumentsDto;
}
