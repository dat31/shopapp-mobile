import { QueryClient } from 'react-query';

const queryClient = new QueryClient();

if (__DEV__) {
  import('react-query-native-devtools').then(({ addPlugin }) => {
    addPlugin({ queryClient });
  });
}

export const PRODUCT_QUERY_KEY = 'products';
export const ORDER_QUERY_KEY = 'orders';
export const CATEGORY_QUERY_KEY = 'categories';
export const EMPLOYEE_QUERY_KEY = 'employees';

export default queryClient;
