import { Service } from 'typedi'
import { AppConfig } from '../../configs'
import { GetMetaDataReqDTO } from './dtos/get-meta-data.dto'
import { DatoCmsService } from '../datocms/datoCms.service'

@Service()
export class MetaService {
    constructor(
        private datoCmsService: DatoCmsService,
        private config: AppConfig,
    ) {}

    async getMetaData(data: GetMetaDataReqDTO) {
        const query = `
        { 
            metaData: metaModel { 
                id 
                title
                description
                previewImage { url alt title }
                _publishedAt 
                _createdAt 
                _updatedAt  
            }
        }
        `

        return await this.datoCmsService.request('POST', query, {}, {})
    }
}
