import { Request } from '@blazjs/common'
import { Service } from 'typedi'
import { IdeaService } from './idea.service'
import { GetIdeasReqDTO } from './dtos/get-ideas.dto'
import { GetIdeaCategoriesReqDTO } from './dtos/get-idea-categories.dto'
import { SubmitIdeaReqDTO } from './dtos/submit-idea.dto'
import { UpvoteIdeaReqDTO } from './dtos/upvote-idea.dto'

@Service()
export class IdeaController {
    constructor(private ideaService: IdeaService) {}

    @Request(GetIdeasReqDTO)
    async getIdeas(data: GetIdeasReqDTO) {
        return await this.ideaService.getIdeas(data)
    }

    @Request(GetIdeaCategoriesReqDTO)
    async getIdeaCategories(data: GetIdeaCategoriesReqDTO) {
        return await this.ideaService.getIdeaCategories(data)
    }

    @Request(SubmitIdeaReqDTO)
    async submitIdea(data: SubmitIdeaReqDTO) {
        return await this.ideaService.submitIdea(data)
    }

    @Request(UpvoteIdeaReqDTO)
    async upvoteIdea(data: UpvoteIdeaReqDTO) {
        return await this.ideaService.upvoteIdea(data)
    }
}
