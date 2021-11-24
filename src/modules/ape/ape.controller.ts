import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApeDto } from './ape.dto';
import { ApeService } from './ape.service';
import { UploadFolderEnum } from '@common/enums/upload-folder.enum';
import { MultiFieldUploadInterceptor } from '../../core/interceptors/upload.interceptor';
import { EndPointsEnum } from '@common/enums/end-points.enum';
import { FileTypesEnum } from '@common/enums/file-types.enum';
import { IsNotEmpty, IsString } from 'class-validator';
import { ParseFile } from '@~/core/pipes/parse-file.pipe';

class body {
    @IsString()
    @IsNotEmpty()
    name: string;
}

@Controller(EndPointsEnum.APE)
export class ApesController {
    constructor(private apeService: ApeService) {}

    @Post('/')
    create(@Body() apeDto: ApeDto) {
        return this.apeService.create(apeDto);
    }

    @UseInterceptors(
        MultiFieldUploadInterceptor([
            { name: 'image', maxCount: 1, destination: UploadFolderEnum.GAllERY, fileTypes: [FileTypesEnum.JPG, FileTypesEnum.JPEG] },
            { name: 'background', maxCount: 3, destination: UploadFolderEnum.PROFILE, fileTypes: [FileTypesEnum.JPG] },
        ]),
    )
    @Post('/upload-test')
    uploadTest(@UploadedFiles(ParseFile) files: { image?: Express.Multer.File; background?: Express.Multer.File[] }, @Body() body: body) {
        console.log(files);
    }
}
