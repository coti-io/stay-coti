import { BaseRoute } from '@blazjs/common'
import { Router } from 'express'
import { Service } from 'typedi'
import { StoryController } from './story.controller'
import { CheckApiKeyMiddleware } from '../middlewares/checkApiKey'

@Service()
export class StoryRoute implements BaseRoute {
    route? = 'stories'
    router: Router = Router()

    constructor(private storyController: StoryController, private checkApiKeyMiddleware: CheckApiKeyMiddleware) {
        this.router.get(
            '/',
            this.checkApiKeyMiddleware.checkApiKey.bind(this.checkApiKeyMiddleware),
            this.storyController.getStories.bind(this.storyController)
        )
    }
}
