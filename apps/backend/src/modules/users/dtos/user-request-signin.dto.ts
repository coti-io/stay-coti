import { DataRequestDTO } from '@blazjs/common'
import { IsString } from 'class-validator'

export interface UserRequestSignInDTO {
    walletAddress: string
}

export class UserRequestSignInDTOReqDTO
    extends DataRequestDTO
    implements UserRequestSignInDTO
{
    @IsString()
    walletAddress: string
}
