import { SortTypeEnum } from "../Enums/order.enum";

export type OrderByType<T> = {
  [key in keyof T]?: SortTypeEnum;
};
