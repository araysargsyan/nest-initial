import { Body, Controller, Post } from '@nestjs/common';
import { ApeDto } from './ape.dto';
import { ApeService } from './ape.service';

@Controller('apes')
export class ApesController {
    constructor(private apeService: ApeService) {}

    @Post('/')
    create(@Body() apeDto: ApeDto) {
        return this.apeService.create(apeDto);
    }
}
