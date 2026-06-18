import {
  BooleanOperationFilterInput,
  DateTimeOperationFilterInput,
  IntOperationFilterInput,
  StringOperationFilterInput,
} from "../Types/filter.types";

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
