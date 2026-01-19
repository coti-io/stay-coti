import { Request } from '@blazjs/common'
import { Service } from 'typedi'
import { SectionService } from './section.service'
import { GetSectionsReqDTO } from './dtos/get-sections.dto'

@Service()
export class SectionController {
    constructor(private sectionService: SectionService) {}

    @Request(GetSectionsReqDTO)
    async getSections(data: GetSectionsReqDTO) {
        return await this.sectionService.getSections(data)
    }
}
