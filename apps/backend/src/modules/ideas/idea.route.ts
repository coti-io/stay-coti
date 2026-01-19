import { BaseRoute } from '@blazjs/common'
import { Router } from 'express'
import { Service } from 'typedi'
import { IdeaController } from './idea.controller'
import { CheckApiKeyMiddleware } from '../middlewares/checkApiKey'
import { AuthMiddleware } from '../auth/auth.middleware'

@Service()
export class IdeaRoute implements BaseRoute {
    route? = 'ideas'
    router: Router = Router()

    constructor(
        private ideaController: IdeaController,
        private checkApiKeyMiddleware: CheckApiKeyMiddleware,
        private authMiddleware: AuthMiddleware,
    ) {
        this.router.get(
            '/',
            this.checkApiKeyMiddleware.checkApiKey.bind(this.checkApiKeyMiddleware),
            this.authMiddleware.authorizeIfNeeded.bind(this.authMiddleware),
            this.ideaController.getIdeas.bind(this.ideaController)
        )

        this.router.get(
            '/categories',
            this.checkApiKeyMiddleware.checkApiKey.bind(this.checkApiKeyMiddleware),
            this.ideaController.getIdeaCategories.bind(this.ideaController)
        )

        this.router.post(
            '/submit',
            this.checkApiKeyMiddleware.checkApiKey.bind(this.checkApiKeyMiddleware),
            this.authMiddleware.authorize.bind(this.authMiddleware),
            this.ideaController.submitIdea.bind(this.ideaController)
        )

        this.router.post(
            '/upvote',
            this.checkApiKeyMiddleware.checkApiKey.bind(this.checkApiKeyMiddleware),
            this.authMiddleware.authorize.bind(this.authMiddleware),
            this.ideaController.upvoteIdea.bind(this.ideaController)
        )
    }
}
