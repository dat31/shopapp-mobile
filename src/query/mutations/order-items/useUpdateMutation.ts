import { Order, OrderItem } from '@/models/Order';
import { ORDER_QUERY_KEY } from '@/query';
import { useSetOrdersQueryData } from '@/query/queries/orders';
import orderItemService from '@/services/order-item-service';
import { AxiosError, AxiosResponse } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useUpdateMutation(orderId: Order['id']) {
  const client = useQueryClient();
  const setQueryData = useSetOrdersQueryData();

  return useMutation<AxiosResponse<OrderItem>, AxiosError, Partial<OrderItem>>({
    mutationFn({ id, ...orderItem }) {
      const orderItemId = client
        .getQueryData<Order>([ORDER_QUERY_KEY, orderId])
        ?.items.find(item => item.product.id === orderItem?.product?.id)?.id;

      if (!orderItemId) {
        return Promise.reject();
      }
      return orderItemService.update(orderItemId, orderItem) as any;
    },
    onSuccess(data) {
      // setQueryData(
      //   produce<Order[]>(orders => {
      //     if (!orders) {
      //       return;
      //     }
      //     const index = (orders as Order[]).findIndex(
      //       order => order.id === orderId,
      //     );
      //     if (index === -1) {
      //       return;
      //     }
      //     const orderItemIndex = orders[index].items.findIndex(
      //       item => item.product.id === data.data.product.id,
      //     );
      //     if (orderItemIndex === -1) {
      //       return;
      //     }
      //     orders[index].items[orderItemIndex] = data.data;
      //   }),
      // );

      client.setQueryData<Order>(
        [ORDER_QUERY_KEY, orderId],
        produce(order => {
          if (!order) {
            return;
          }
          const orderItemIndex = order.items.findIndex(
            item => item.product.id === data.data.product.id,
          );
          order.items[orderItemIndex] = data.data;
        }),
      );
    },
  });
}
