import { Service } from 'typedi'
import { AppConfig } from '../../configs'
import { GetStoriesDTO } from './dtos/get-stories.dto'
import { DatoCmsService } from '../datocms/datoCms.service'

@Service()
export class StoryService {
    constructor(
        private datoCmsService: DatoCmsService,
        private config: AppConfig
    ) {}

    async getStories(data: GetStoriesDTO) {
        const { limit = 10, page = 1, orderByKey = '_createdAt', orderByValue = 'desc' } = data;
        
        const orderBy = `${orderByKey}_${orderByValue.toUpperCase()}`;
        const skip = (page - 1) * limit;
        const query = `
        {
            allStories(first: ${limit}, skip: ${skip}, orderBy: ${orderBy}) {
                id
                name
                sapo
                description
                telegram
                linkedin
                twitter
                avatar { url title alt }
                video
                _createdAt
                _updatedAt
            }
            _allStoriesMeta { count }
        }`;

        const queryParams = {
            preview: true,
        };

        return await this.datoCmsService.request("POST", query, {}, queryParams);
        // return this.datoCmsService.formatPaginatedResponse(response, 'allStories', page, limit);
    }
}
