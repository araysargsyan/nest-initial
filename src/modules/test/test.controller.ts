import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadFolderEnum } from '@/common/enums/upload-folder.enum';
import { EndPointsEnum } from '@/common/enums/end-points.enum';
import { FileTypesEnum } from '@/common/enums/file-types.enum';
import { SafeFilePipe } from '@/core/pipes/safe-file.pipe';
import { TestService } from '@/modules/test/test.service';
import { TestDto } from '@/modules/test/dto/test.dto';
import { UploadTestDto } from '@/modules/test/dto/upload-test.dto';
import { UploadFilesInterceptor } from '@/core/interceptors/upload.interceptor';

@Controller(EndPointsEnum.TEST)
export class TestController {
    constructor(private apeService: TestService) {}

    @Post('/')
    create(@Body() apeDto: TestDto) {
        return this.apeService.create(apeDto);
    }

    @Post('/upload-test')
    @UseInterceptors(
        UploadFilesInterceptor([
            { name: 'image', types: [FileTypesEnum.JPG, FileTypesEnum.JPEG], destination: UploadFolderEnum.GAllERY },
            { name: 'background', types: [FileTypesEnum.JPG], destination: UploadFolderEnum.PROFILE, maxCount: 300 },
            { name: 'documents[4]files', types: [FileTypesEnum.JPG, FileTypesEnum.JPEG], destination: UploadFolderEnum.DOCUMENTS, maxCount: 5 },
        ]),
    )
    uploadTest(@UploadedFiles(SafeFilePipe) files: UploadTestDto, @Body() body: TestDto) {
        console.log('uploadTest->controller');
    }
}
