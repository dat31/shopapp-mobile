import { View } from '@/components';
import { Order } from '@/models/Order';
import { Text, makeStyles } from '@rneui/themed';
import { format } from 'date-fns';

type Props = {
  order: Order;
};

function OrderInformation({ order }: Props) {
  const styles = useStyles();
  return (
    <>
      <View p-lg style={styles.root}>
        <Text h4 style={styles.orderInfo}>
          Information
        </Text>
        <View row space-between>
          <Text>Time:</Text>
          <Text>
            {format(new Date(order?.orderDate as string), 'MM/dd HH:mm')}
          </Text>
        </View>

        <View row space-between>
          <Text>Number: </Text>
          <Text>{order?.id}</Text>
        </View>

        <View row space-between>
          <Text>Creator: </Text>
          <Text>Waiter</Text>
        </View>

        <View row space-between>
          <Text>Status: </Text>
          <Text>{order.status}</Text>
        </View>
      </View>
      <Text h4 style={[styles.orderInfo, styles.orderProds]}>
        Products
      </Text>
    </>
  );
}

export default OrderInformation;

const useStyles = makeStyles(({ colors, spacing }) => ({
  totalPriceView: {
    borderTopColor: colors.greyOutline,
    borderTopWidth: 1,
  },
  root: {
    gap: spacing.md,
  },
  orderInfo: {
    color: colors.primary,
  },
  orderProds: {
    marginLeft: spacing.lg,
    marginTop: spacing.md,
  },
}));
