import { Service } from 'typedi'
import { AppConfig } from '../../configs'
import { GetSectionsDTO } from './dtos/get-sections.dto'
import { DatoCmsService } from '../datocms/datoCms.service'

@Service()
export class SectionService {
    constructor(
        private datoCmsService: DatoCmsService,
        private config: AppConfig,
    ) {}

    async getSections(data: GetSectionsDTO) {
        const {
            limit = 10,
            page = 1,
            orderByKey = 'menuPosition',
            orderByValue = 'asc',
        } = data

        const orderBy = `${orderByKey}_${orderByValue.toUpperCase()}`
        const skip = (page - 1) * limit
        const query = `
        {
            allMenuSections(first: ${limit}, skip: ${skip}, orderBy: ${orderBy}) {
                id
                menuName
                sectionId
                sectionName
                sectionDescription
                _createdAt
                _updatedAt
            }
            _allMenuSectionsMeta { count }
        }`

        return await this.datoCmsService.request('POST', query, {}, {})
    }
}
