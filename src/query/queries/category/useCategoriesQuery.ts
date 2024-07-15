import { service } from '@/services/axios';
import { useQuery } from 'react-query';

export const QUERY_KEY = 'categories';

export default function useCategoriesQuery() {
  return useQuery(QUERY_KEY, () =>
    service.get('/categories').then(({ data }) => data),
  );
}
