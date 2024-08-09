import { Order, OrderItem } from '@/models/Order';
import { ORDER_QUERY_KEY } from '@/query';
import { useSetOrdersQueryData } from '@/query/queries/orders';
import orderItemService from '@/services/order-item-service';
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useDecreaseQtyMutation() {
  const client = useQueryClient();
  const setQueryData = useSetOrdersQueryData();
  return useMutation<
    AxiosResponse<OrderItem | void>,
    AxiosError,
    { odId: Order['id']; odItem: OrderItem }
  >({
    mutationFn({ odId, odItem }) {
      const order = client.getQueryData<Order>([
        ORDER_QUERY_KEY,
        odId,
      ]) as Order;
      const odItemIdx = order?.items.findIndex(
        item => item.product.id === odItem.product.id,
      ) as number;

      const currentQty = order.items[odItemIdx].quantity;
      const { id } = order.items[odItemIdx];

      if (currentQty === 1) {
        return orderItemService.delete(id) as any;
      }

      return orderItemService.update(id, {
        ...order.items[odItemIdx],
        quantity: order.items[odItemIdx].quantity - 1,
      });
    },
    onSuccess(data, { odId, odItem }) {
      if (data.status === HttpStatusCode.NoContent) {
        // setQueryData(
        //   produce<Order[]>(orders => {
        //     const order = orders.find(od => od.id === odId);
        //     if (!order) {
        //       return;
        //     }
        //     const item = order.items.find(
        //       i => i.product.id === odItem.product.id,
        //     );
        //     if (!item) {
        //       return;
        //     }
        //     order.items = order.items.filter(
        //       item => item.product.id === odItem.product.id,
        //     );
        //   }),
        // );
        client.setQueryData(
          [ORDER_QUERY_KEY, odId],
          produce<Order>(order => {
            order.items = order.items.filter(
              item => item.product.id !== odItem.product.id,
            );
          }),
        );
        return;
      }

      client.setQueryData(
        [ORDER_QUERY_KEY, odId],
        produce<Order>(order => {
          const item = order.items.find(
            i => i.product.id === odItem.product.id,
          );
          if (!item) {
            return;
          }
          item.quantity = (data.data as OrderItem).quantity;
        }),
      );

      // setQueryData(
      //   produce<Order[]>(orders => {
      //     const order = orders.find(od => od.id === odId);
      //     if (!order) {
      //       return;
      //     }
      //     const item = order.items.find(
      //       i => i.product.id === odItem.product.id,
      //     );
      //     if (!item) {
      //       return;
      //     }
      //     item.quantity = item.quantity - 1;
      //   }),
      // );
    },
  });
}
