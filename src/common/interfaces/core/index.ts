import { MulterField, MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileTypesEnum } from '@/common/enums/file-types.enum';
import { UploadFolderEnum } from '@/common/enums/upload-folder.enum';

export interface OrmSeedInterface {
    seeds: string[];
    factories: string[];
}

export interface fileOption extends MulterField {
    types?: FileTypesEnum[];
    destination?: UploadFolderEnum;
    localOptions?: MulterOptions;
}
