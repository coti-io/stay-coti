import { BaseRequestDTO, DataRequestDTO } from '@blazjs/common'
import { IsNumber, IsString } from 'class-validator'
import { AuthRequestDTO } from '../../auth/auth-request.dto'

export interface GetIdeasDTO {
    limit?: number
    page?: number
    orderByKey?: string
    orderByValue?: string
    categoryId?: string
    search?: string
    userId?: string
    authorId?: string
}

export class GetIdeasReqDTO extends AuthRequestDTO implements GetIdeasDTO {
    @IsString()
    orderByKey: string = '_publishedAt'

    @IsString()
    orderByValue: string = 'desc'

    @IsNumber()
    limit: number = 10

    @IsNumber()
    page: number = 1  
    
    @IsString()
    categoryId: string = ''

    @IsString()
    search: string = ''
}
