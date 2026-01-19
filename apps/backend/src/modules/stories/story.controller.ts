import { Request } from '@blazjs/common'
import { Service } from 'typedi'
import { StoryService } from './story.service'
import { GetStoriesReqDTO } from './dtos/get-stories.dto'

@Service()
export class StoryController {
    constructor(private storyService: StoryService) {}

    @Request(GetStoriesReqDTO)
    async getStories(data: GetStoriesReqDTO) {
        return await this.storyService.getStories(data)
    }
}
