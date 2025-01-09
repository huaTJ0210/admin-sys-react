export interface ISelectOptionItem {
  value: string;
  label: string;
}

export interface IResponseList<T> {
  list: Array<T>;
  total: number;
}
