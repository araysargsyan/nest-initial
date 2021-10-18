import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApeDto } from './ape.dto';
import { ApeService } from './ape.service';
import { UploadFilesInterceptor } from '@common/core/interceptors/upload.interceptor';
import { UploadFolderEnum } from '@common/enums/upload-folder.enum';
import { FileTypesEnum } from '@common/enums/file-types.enum';

@Controller('apes')
export class ApesController {
    constructor(private apeService: ApeService) {}

    @Post('/')
    create(@Body() apeDto: ApeDto) {
        return this.apeService.create(apeDto);
    }

    @UseInterceptors(UploadFilesInterceptor('image', 6, UploadFolderEnum.PROFILE, [FileTypesEnum.PNG, FileTypesEnum.JPEG, FileTypesEnum.JPG]))
    @Post('/upload-test')
    uploadTest(@UploadedFiles() image: Express.Multer.File[]) {
        console.log(image);
    }
}
