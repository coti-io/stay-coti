import { Service } from 'typedi'
import { AppConfig } from '../../configs'

@Service()
export class WebhookService {
    constructor(
        private config: AppConfig
    ) {}

}
