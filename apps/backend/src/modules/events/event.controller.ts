import { Request } from '@blazjs/common'
import { Service } from 'typedi'
import { EventService } from './event.service'
import { GetEventReqDTO } from './dtos/get-events.dto'
import { GetCotiEventsReqDTO } from './dtos/get-coti-events.dto'

@Service()
export class EventController {
    constructor(private eventService: EventService) {}

    @Request(GetEventReqDTO)
    async getEvents(data: GetEventReqDTO) {
        return await this.eventService.getEvents(data)
    }

    @Request(GetCotiEventsReqDTO)
    async getCotiEvents(data: GetCotiEventsReqDTO) {
        return await this.eventService.getCotiEvents(data)
    }
}
