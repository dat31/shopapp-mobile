import { AxiosError } from 'axios';

export type SortDirection =
  | 1
  | -1
  | 'asc'
  | 'desc'
  | 'ascending'
  | 'descending'
  | {
      $meta: string;
    };

export type PaginatedResponse<T> = {
  data: T[];
  next?: number;
  previous?: number;
};

export type BaseModel = {
  id: number;
};

export type PaginatedRequest<T> = {
  page: number;
  order?: { [k in keyof T]: SortDirection };
} & Partial<T>;

export type ErrorResponse = AxiosError;
