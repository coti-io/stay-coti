import { DataRequestDTO } from '@blazjs/common'
import { IsString } from 'class-validator'

export interface UserVerifySignInDTO {
    walletAddress: string
    signature: string
}

export class UserVerifySignInDTOReqDTO
    extends DataRequestDTO
    implements UserVerifySignInDTO
{
    @IsString()
    walletAddress: string

    @IsString()
    signature: string
}
