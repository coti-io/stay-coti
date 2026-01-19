import axios, { Method } from 'axios'
import { Service } from 'typedi'
import { AppConfig } from '../../configs'
import { Errors } from '../../utils/error'

@Service()
export class DatoCmsService {
    constructor(
        private config: AppConfig
    ) {}

    async request<T>(
        method: Method,
        query?: string,
        variables?: Record<string, any>,
        queryParams?: Record<string, any>
    ): Promise<T> {
        try {
            const response = await axios({
                method,
                url: this.config.datoCms.host,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.config.datoCms.token}`
                },
                params: queryParams,
                data: query ? { query, variables } : undefined
            });

            if (!response?.data?.data) {
                throw Errors.DatoCmsServerError;
            }

            return response.data.data;
        } catch (error) {
            console.error("Error from DatoCMS:", error.response?.data || error.message);
            throw Errors.DatoCmsServerError;
        }
    }

    async requestApi<T>(
        method: Method,
        data?: Record<string, any>,
        queryParams?: Record<string, any>,
        endpoint?: string
    ): Promise<T> {
        try {
            const url = endpoint 
            ? `${this.config.datoCms.apiHost}/${endpoint}` 
            : this.config.datoCms.apiHost;

            const response = await axios({
                method: method,
                url: url,
                headers: {
                    "X-Api-Version": `${this.config.datoCms.apiVersion}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${this.config.datoCms.token}`
                },
                params: queryParams,
                data: data
            });

            if (!response?.data?.data) {
                throw Errors.DatoCmsServerError;
            }

            return response.data.data;
        } catch (error) {
            console.error("Error from DatoCMS:", error.response?.data || error.message);
            throw Errors.DatoCmsServerError;
        }
    }

    async formatPaginatedResponse(data: any, keyData: string, page: number = 1, limit: number = 10) {

        const keyDataMeta = "_" + keyData + "Meta"

        if (!data || !data[keyData] || !data[keyDataMeta]) {
            throw new Error("Invalid response format from GraphQL");
        }
    
        return {
            data: data[keyData] ?? [],
            pagination: {
                total: data[keyDataMeta]?.count ?? 0,
                page,
                limit
            }
        };
    }
}
