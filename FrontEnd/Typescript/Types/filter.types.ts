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
export type BooleanOperationFilterInput = {
  eq?: boolean;
  neq?: boolean;
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
