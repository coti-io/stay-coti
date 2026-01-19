import { BaseRoute } from '@blazjs/common'
import { Router } from 'express'
import { Service } from 'typedi'
import { WebhookController } from './webhook.controller'
import { CheckApiKeyMiddleware } from '../middlewares/checkApiKey'

@Service()
export class WebhookRoute implements BaseRoute {
    route? = 'webhooks'
    router: Router = Router()

    constructor(
        private webhookController: WebhookController,
        private checkApiKeyMiddleware: CheckApiKeyMiddleware
    ) {
        this.router.post(
            '/idea-status',
            this.checkApiKeyMiddleware.checkApiKey.bind(this.checkApiKeyMiddleware),
            this.webhookController.saveActionLog.bind(this.webhookController)
        )
    }
}
