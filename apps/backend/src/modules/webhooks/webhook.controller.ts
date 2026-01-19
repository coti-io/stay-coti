import { Request } from '@blazjs/common'
import { Service } from 'typedi'
import { WebhookService } from './webhook.service'
import { SaveActionLogReqDTO } from '../ideas/dtos/save-action-log.dto'
import { IdeaService } from '../ideas/idea.service'

@Service()
export class WebhookController {
    constructor(
        private webhookService: WebhookService,
        private ideaService: IdeaService,
    ) {}

    @Request(SaveActionLogReqDTO)
    async saveActionLog(data: SaveActionLogReqDTO) {
        return await this.ideaService.saveActionLog(data)
    }
}
