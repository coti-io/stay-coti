import { Service } from 'typedi'
import { AppConfig } from '../../configs'
import { GetIdeasDTO } from './dtos/get-ideas.dto'
import { DatoCmsService } from '../datocms/datoCms.service'
import { SubmitIdeaDTO } from './dtos/submit-idea.dto'
import { GetUserIdeasDTO } from '../users/dtos/get-user-ideas.dto'
import { User } from '../users/entities/user.entity'
import { Errors } from '../../utils/error'
import { SaveActionLogDTO } from './dtos/save-action-log.dto'
import { EthersService } from '../ethers/ethers.service'
import { ethers, TransactionResponse } from 'ethers'
import { UpvoteIdeaDTO } from './dtos/upvote-idea.dto'

@Service()
export class IdeaService {
    constructor(
        private datoCmsService: DatoCmsService,
        private ethersService: EthersService,
        private config: AppConfig,
    ) {}

    async getIdeas(data: GetIdeasDTO) {
        const { authorId }  = data
        const {
            limit = 10,
            page = 1,
            orderByKey = '_publishedAt',
            orderByValue = 'desc',
            categoryId,
            search = '',
        } = data

        const orderBy = `${orderByKey}_${orderByValue.toUpperCase()}`
        const skip = (page - 1) * limit
        const variables = {
            limit,
            skip,
            search,
            orderBy: [orderBy],
            ...(categoryId && { categoryId: categoryId }),
        }

        const query = `
            query($limit: IntType, $skip: IntType, $search: String!, ${
                categoryId ? '$categoryId: ItemId, ' : ''
            }$orderBy: [IdeaModelOrderBy!]) { 
                allIdeas(
                    first: $limit, 
                    skip: $skip, 
                    filter: { 
                        name: { matches: { pattern: $search } },
                        ideaStatus: { eq: "approved" }
                        ${categoryId ? ', category: { eq: $categoryId }' : ''} 
                    }, 
                    orderBy: $orderBy
                ) { 
                    id
                    name
                    description
                    upvote
                    flag
                    ideaStatus
                    reason
                    category { id name }
                    author { id name picture { url alt } }
                    upvotedUsers { id }
                    _publishedAt
                    _createdAt
                } 
                _allIdeasMeta(filter: { 
                    name: { matches: { pattern: $search } },
                    ideaStatus: { eq: "approved" }
                    ${categoryId ? ', category: { eq: $categoryId }' : ''} 
                }) { 
                    count 
                }
            }
        `

        const response = (await this.datoCmsService.request(
            'POST',
            query,
            variables,
            {},
        )) as { allIdeas: { id: string; upvotedUsers?: { id: string }[] }[] }
        
        if (authorId && response.allIdeas) {
            response.allIdeas = response.allIdeas.map(idea => ({
                ...idea,
                hasUpvoted: Array.isArray(idea.upvotedUsers)
                    ? idea.upvotedUsers.some(user => user.id === authorId)
                    : false,
            }))
        }
        
        return response
        
    }

    async getIdeaCategories(data: GetIdeasDTO) {
        const query = `{ allCategories { id name _createdAt _updatedAt } }`

        return this.datoCmsService.request('POST', query, {}, {})
    }

    async submitIdea(data: SubmitIdeaDTO) {
        const { name, description, categoryId, walletAddress, authorId } = data

        if (!walletAddress) {
            throw Errors.MissingParameter
        }
        const provider = this.ethersService.provider()
        const balance = await provider.getBalance(walletAddress)
        const minRequired = ethers.parseUnits('1', 18)
        if (balance < minRequired) {
            throw Errors.InsufficientBalance
        }

        const dataIdea = {
            data: {
                type: 'item',
                attributes: {
                    name: name,
                    description: description,
                    brief: '',
                    upvote: 0,
                    category: categoryId,
                    author: authorId,
                },
                relationships: {
                    item_type: {
                        data: {
                            type: 'item_type',
                            id: this.config.datoCms.modelIdea, // ModelID of Idea
                        },
                    },
                },
            },
        }

        return this.datoCmsService.requestApi('POST', dataIdea, {})
    }

    async getUserIdeas(data: GetUserIdeasDTO) {
        const {
            limit = 10,
            page = 1,
            orderByKey = '_publishedAt',
            orderByValue = 'desc',
            search = '',
            authorId
        } = data

        const orderBy = `${orderByKey}_${orderByValue.toUpperCase()}`
        const skip = (page - 1) * limit
        const variables = {
            limit,
            skip,
            search,
            orderBy: [orderBy],
            ...(authorId && { authorId: authorId }),
        }

        const query = `
            query($limit: IntType, $skip: IntType, $search: String!, ${
                authorId ? '$authorId: ItemId, ' : ''
            }$orderBy: [IdeaModelOrderBy!]) { 
                allIdeas(
                    first: $limit, 
                    skip: $skip, 
                    filter: { 
                        name: { matches: { pattern: $search } } 
                        ${authorId ? ', author: { eq: $authorId }' : ''} 
                    }, 
                    orderBy: $orderBy
                ) { 
                    id name description upvote flag ideaStatus reason category { id name } author { id name picture { url alt } } _publishedAt _createdAt
                } 
                _allIdeasMeta { count } 
            }
        `

        return this.datoCmsService.request(
            'POST',
            query,
            variables,
            {},
        )
    }

    async saveActionLog(data: SaveActionLogDTO) {
        const { entity, previous_entity } = data

        if (!entity || !previous_entity) {
            throw Errors.WebhookDataDatoCmsServerError
        }

        const ideaId = entity.id
        const newStatus = entity.attributes.idea_status
        const oldStatus = previous_entity.attributes.idea_status || 'unknown'

        if (newStatus === oldStatus)
            return {
                message: 'No change status.',
            }

        const dataIdea = {
            data: {
                type: 'item',
                attributes: {
                    idea: ideaId,
                    old_status: newStatus,
                    new_status: oldStatus,
                },
                relationships: {
                    item_type: {
                        data: {
                            type: 'item_type',
                            id: 'U7Hdu1lVQx6MSzgglidZ2g', // ModelID of Idea Action logs
                        },
                    },
                },
            },
        }

        return this.datoCmsService.requestApi('POST', dataIdea, {})
    }

    async upvoteIdea(data: UpvoteIdeaDTO) {
        const { ideaId, walletAddress, transactionHash, authorId } = data
        if (!walletAddress || !transactionHash) {
            throw Errors.MissingParameter
        }

        const provider = this.ethersService.provider()
        const receipt = await provider.getTransactionReceipt(transactionHash)
        if (!receipt) {
            throw Errors.TransactionNotFound
        }
        // 1 => success;  0 => fail
        if (receipt.status !== 1) {
            throw Errors.TransactionFailed
        }

        const tx = await provider.getTransaction(transactionHash)
        if (!tx) {
            throw Errors.TransactionNotFound
        }
        const result = this.verifyUpvoteTransaction(tx, walletAddress)
        if (!result) throw Errors.InvalidTransactionDetail

        // Get idea
        const idea = (await this.datoCmsService.requestApi(
            'GET',
            {},
            {},
            ideaId,
        )) as any
        if (!idea?.attributes) {
            throw Errors.DatoCmsIdeaNotFoundError
        }

        const currentUpvotedUsers = idea.attributes.upvoted_users || [];
        if (currentUpvotedUsers.includes(authorId)) {
            throw Errors.DatoCmsUpvotedIdeaError
        }

        const currentUpvote = idea.attributes.upvote || 0
        const newUpvote = currentUpvote + 1

        const updatedUpvotedUsers = Array.from(new Set([...currentUpvotedUsers, authorId]));


        const dataIdea = {
            data: {
                id: ideaId,
                type: 'item',
                attributes: {
                    upvote: newUpvote,
                    upvoted_users: updatedUpvotedUsers
                },
                relationships: {
                    item_type: {
                        data: {
                            type: 'item_type',
                            id: this.config.datoCms.modelIdea, // ModelID of Idea
                        },
                    },
                },
            },
        }

        return this.datoCmsService.requestApi('PATCH', dataIdea, {}, ideaId)
    }

    private verifyUpvoteTransaction(
        tx: TransactionResponse,
        walletAddress: string,
    ) {
        if (
            tx.from.toLowerCase() !== walletAddress.toLowerCase() ||
            !tx.to ||
            tx.to.toLowerCase() !==
                this.config.voteReceiverAddress.toLowerCase() ||
            tx.value < ethers.parseUnits('0.01', 18)
        ) {
            return false
        }
        return true
    }
}
