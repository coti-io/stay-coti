import { BaseRoute } from '@blazjs/common'
import { Router } from 'express'
import { Service } from 'typedi'
import { MetaController } from './meta.controller'
import { CheckApiKeyMiddleware } from '../middlewares/checkApiKey'

@Service()
export class MetaRoute implements BaseRoute {
    route? = 'meta'
    router: Router = Router()

    constructor(
        private metaController: MetaController,
        private checkApiKeyMiddleware: CheckApiKeyMiddleware,
    ) {
        this.router.get(
            '/',
            this.checkApiKeyMiddleware.checkApiKey.bind(this.checkApiKeyMiddleware),
            this.metaController.getMetaData.bind(this.metaController),
        )
    }
}
