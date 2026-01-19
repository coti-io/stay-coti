import { Service } from 'typedi'
import { AppConfig } from '../../configs'
import { GetEventReqDTO } from './dtos/get-events.dto'
import { DatoCmsService } from '../datocms/datoCms.service'
import { GetCotiEventsReqDTO } from './dtos/get-coti-events.dto'

export const STRUCTURE_EVENT = `
    id
    title
    location
    description
    content
    registerUrl
    specialType
    isSpecialEvent
    isCotiEvent
    startDateTime
    endDateTime
    avatar {
        url
        title
        alt
    }
    createdBy {
        id
        name
    }
    _publishedAt
    _createdAt
    _updatedAt
`;

@Service()
export class EventService {
    constructor(
        private datoCmsService: DatoCmsService,
        private config: AppConfig,
    ) {}

    async getEvents(data: GetEventReqDTO) {
        const {
            limit = 10,
            page = 1,
            orderByKey = 'startDateTime',
            orderByValue = 'asc',
        } = data

        const orderBy = `${orderByKey}_${orderByValue.toUpperCase()}`
        const skip = (page - 1) * limit
        const todayISO = new Date().toISOString()
        const query = `
        { 
            specialFirstEvent: allEvents(first: 1, orderBy: _createdAt_DESC, filter: {
                isSpecialEvent: { eq: true },
                specialType: { eq: "first" }
            }) {
                ${STRUCTURE_EVENT}
            }
            specialSecondEvent: allEvents(first: 1, orderBy: _createdAt_DESC, filter: {
                isSpecialEvent: { eq: true },
                specialType: { eq: "second" }
            }) {
                ${STRUCTURE_EVENT}
            }
            specialLastEvent: allEvents(first: 1, orderBy: _createdAt_DESC, filter: {
                isSpecialEvent: { eq: true },
                specialType: { eq: "last" }
            }) {
                ${STRUCTURE_EVENT}
            }
            allEvents(first: ${limit}, skip: ${skip}, orderBy: ${orderBy}, filter: { 
                startDateTime: { gt: "${todayISO}" },
                isSpecialEvent: { eq: false },
                isCotiEvent: { eq: false }
            }) { 
                ${STRUCTURE_EVENT}  
            }
            _allEventsMeta(filter: {
                startDateTime: { gt: "${todayISO}" },
                isSpecialEvent: { eq: false },
                isCotiEvent: { eq: false }
            }) { count }
        }
        `

        return await this.datoCmsService.request('POST', query, {}, {})
    }

    async getCotiEvents(data: GetCotiEventsReqDTO) {
        const {
            limit = 10,
            page = 1,
            orderByKey = 'startDateTime',
            orderByValue = 'asc',
        } = data

        const orderBy = `${orderByKey}_${orderByValue.toUpperCase()}`
        const skip = (page - 1) * limit
        const todayISO = new Date().toISOString()
        const query = `
        { 
            cotiEvent { 
                id 
                title
                description 
                totalEvents 
                _publishedAt 
                _createdAt 
                _updatedAt  
            }
            allEvents(first: ${limit}, skip: ${skip}, orderBy: ${orderBy}, filter: { 
                startDateTime: { gt: "${todayISO}" },
                isSpecialEvent: { eq: false },
                isCotiEvent: { eq: true }
            }) { 
                ${STRUCTURE_EVENT}
            }
            _allEventsMeta(filter: { 
                startDateTime: { gt: "${todayISO}" },
                isSpecialEvent: { eq: false },
                isCotiEvent: { eq: true }
            }) { count }
        }
        `

        return await this.datoCmsService.request('POST', query, {}, {})
    }
}
