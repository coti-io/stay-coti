import { BaseRoute } from '@blazjs/common'
import { Router } from 'express'
import { Service } from 'typedi'
import { SectionController } from './section.controller'
import { CheckApiKeyMiddleware } from '../middlewares/checkApiKey'

@Service()
export class SectionRoute implements BaseRoute {
    route? = 'sections'
    router: Router = Router()

    constructor(
        private sectionController: SectionController,
        private checkApiKeyMiddleware: CheckApiKeyMiddleware,
    ) {
        this.router.get(
            '/',
            this.checkApiKeyMiddleware.checkApiKey.bind(this.checkApiKeyMiddleware),
            this.sectionController.getSections.bind(this.sectionController),
        )
    }
}
