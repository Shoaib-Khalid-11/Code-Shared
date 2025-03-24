import { PaginationRequest } from './pagination.model';
import { OrderByType } from './order.models';
import { DynamicFilter, FilterableApiResponse, FilterType, LogicalOperators } from './filter.models';

export type QueryBaseTypes<T extends object> = {
    pagination?: PaginationRequest;
    // where?: FilterType<T>;
    where?: FilterableApiResponse<T>;
    order?: OrderByType<T>;
};
export type ApiBaseResponse<K extends string, T> = {
    [key in K]: T;
};
export interface ApiResponseData<T> {
    data?: T[];
    isError?: boolean;
    isSuccess?: boolean;
    message?: string;
    totalCount?: number;
    singleData?: T;
}
