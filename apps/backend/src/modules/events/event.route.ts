import { BaseRoute } from '@blazjs/common'
import { Router } from 'express'
import { Service } from 'typedi'
import { EventController } from './event.controller'
import { CheckApiKeyMiddleware } from '../middlewares/checkApiKey'

@Service()
export class EventRoute implements BaseRoute {
    route? = 'events'
    router: Router = Router()

    constructor(private eventController: EventController, private checkApiKeyMiddleware: CheckApiKeyMiddleware) {
        this.router.get(
            '/',
            this.checkApiKeyMiddleware.checkApiKey.bind(this.checkApiKeyMiddleware),
            this.eventController.getEvents.bind(this.eventController)
        )

        this.router.get(
            '/coti',
            this.checkApiKeyMiddleware.checkApiKey.bind(this.checkApiKeyMiddleware),
            this.eventController.getCotiEvents.bind(this.eventController)
        )
    }
}
