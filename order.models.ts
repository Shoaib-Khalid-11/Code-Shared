export enum SortTypeEnum {
    ASC = 'ASC',
    DESC = 'DESC'
}
export type OrderByType<T> = {
    [key in keyof T]?: SortTypeEnum;
};
