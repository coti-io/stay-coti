import { Request } from '@blazjs/common'
import { Service } from 'typedi'
import { MetaService } from './meta.service'
import { GetMetaDataReqDTO } from './dtos/get-meta-data.dto'

@Service()
export class MetaController {
    constructor(private metaService: MetaService) {}

    @Request(GetMetaDataReqDTO)
    async getMetaData(data: GetMetaDataReqDTO) {
        return await this.metaService.getMetaData(data)
    }
}
