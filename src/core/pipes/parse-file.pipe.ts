import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseFile implements PipeTransform {
    async transform(files: Express.Multer.File | Express.Multer.File[], metadata: ArgumentMetadata): Promise<Express.Multer.File | Express.Multer.File[]> {
        console.log('777777777788888888888', metadata.type);
        if (files === undefined || files === null) {
            throw new BadRequestException('Validation failed (file expected)');
        }

        if (Array.isArray(files) && files.length === 0) {
            throw new BadRequestException('Validation failed (files expected)');
        }

        return files;
    }
}
