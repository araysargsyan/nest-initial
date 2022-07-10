import { SafeFileCheckingModeEnum } from '@/common/enums/safe-file-checking-mode.enum';

export const uploadsFolder = 'uploads';
export const safeFileCheckingMode: SafeFileCheckingModeEnum = SafeFileCheckingModeEnum.EXPERIMENTAL;

//! ENV
export const PUBLIC_FOLDER = 'PUBLIC_FOLDER' as const;

//! CORE
export const NOTE_SAFE_FILES = 'NOTE_SAFE_FILES' as const;
export const SAFE_FILE = 'SAFE_FILE' as const;
