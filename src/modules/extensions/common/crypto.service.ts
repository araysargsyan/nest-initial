import * as crypto from 'crypto-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

@Injectable()
export class CryptoService {
    constructor(private configService: ConfigService) {}

    public encrypt(data, isUriComponent = false) {
        const encryptedData = crypto.AES.encrypt(JSON.stringify(data), secretKey).toString();
        return isUriComponent ? encodeURIComponent(encryptedData) : encryptedData;
    }

    public decrypt(encryptedData, isUriComponent = false) {
        return JSON.parse(crypto.AES.decrypt(isUriComponent ? decodeURIComponent(encryptedData) : encryptedData, secretKey).toString(crypto.enc.Utf8));
    }
}
