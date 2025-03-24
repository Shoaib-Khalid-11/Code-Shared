export type StringOperationFilterInput = {
    and?: StringOperationFilterInput[];
    contains?: string;
    endsWith?: string;
    eq?: string;
    in?: string[];
    ncontains?: string;
    nendsWith?: string;
    neq?: string;
    nin?: string[];
    nstartsWith?: string;
    or?: StringOperationFilterInput[];
    startsWith?: string;
};
export type IntOperationFilterInput = {
    eq?: number;
    gt?: number;
    gte?: number;
    in?: number[];
    it?: number;
    ite?: number;
    neq?: number;
    ngt?: number;
    ngte?: number;
    nin?: number[];
    nlt?: number;
    nlte?: number;
};

export type DateTimeOperationFilterInput = {
    eq?: Date | string;
    gt?: Date | string;
    gte?: Date | string;
    in?: Date[] | string[];
    it?: Date | string;
    ite?: Date | string;
    neq?: Date | string;
    ngt?: Date | string;
    ngte?: Date | string;
    nin?: Date[] | string[];
    nlt?: Date | string;
    nlte?: Date | string;
};
export type BooleanOperationFilterInput = {
    eq?: boolean;
    neq?: boolean;
};
export type DynamicTyping<T> = T extends string
    ? StringOperationFilterInput
    : T extends number
      ? IntOperationFilterInput
      : T extends boolean
        ? BooleanOperationFilterInput
        : T extends Date
          ? DateTimeOperationFilterInput
          : T extends Array<infer U>
            ? DataFilter<U>
            : T extends object
              ? DynamicFilter<T>
              : never;
// export type FilterType<T> = {
//     [K in keyof T]?: DynamicTyping<T[K]>;
// } & LogicalOperators<T>;
export type FilterType<T> = {
    [K in keyof T]?: T[K] extends string
        ? StringOperationFilterInput
        : T[K] extends number
          ? IntOperationFilterInput
          : T[K] extends boolean
            ? BooleanOperationFilterInput
            : T[K] extends Date
              ? DateTimeOperationFilterInput
              : never;
} & LogicalOperators<T>;

export type LogicalOperators<T> = {
    or?: DynamicFilter<T>[];
    and?: DynamicFilter<T>[];
};
export type DataFilter<T> = {
    all?: DynamicFilter<T>;
    some?: DynamicFilter<T>;
    none?: DynamicFilter<T>;
    any?: boolean;
};
export type DynamicFilter<T> = Partial<{
    [K in keyof T]?: DynamicTyping<T[K]>;
}> &
    LogicalOperators<T>;
export type FilterableApiResponse<T> = Partial<{
    data?: DataFilter<T>[];
    singleData?: DynamicFilter<T>;
    isError?: DynamicTyping<boolean>;
    isSuccess?: DynamicTyping<boolean>;
    message?: DynamicTyping<string>;
    totalCount?: DynamicTyping<number>;
}> &
    LogicalOperators<{
        data: DataFilter<T>[];
        singleData: DynamicFilter<T>;
        isError: DynamicTyping<boolean>;
        isSuccess: DynamicTyping<boolean>;
        message: DynamicTyping<string>;
        totalCount: DynamicTyping<number>;
    }>;
