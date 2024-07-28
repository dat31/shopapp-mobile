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
export type PaginatedRequest<T> = { take?: number; skip?: number } & T;
