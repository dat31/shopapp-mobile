import { Order, Status } from '@/models/Order';
import formatCurrency from '@/utils/format-currency';
import { Avatar, ListItem, Text, makeStyles } from '@rneui/themed';
import { format } from 'date-fns';
import { memo } from 'react';
import { TouchableHighlight, View } from 'react-native';

type Props = {
  item: Order;
  onPress: (item: Order) => void;
  dateFormatPattern: string;
};

function OrderItem({ item, onPress, dateFormatPattern }: Props) {
  const styles = useStyles(item.status);
  return (
    <ListItem
      Component={TouchableHighlight}
      onPress={() => {
        onPress(item);
      }}>
      <Avatar
        Component={View}
        ImageComponent={View}
        title={item.table || '#'}
        size={40}
        containerStyle={styles.avt}
      />
      <ListItem.Content>
        <ListItem.Title>
          {format(new Date(item.orderDate), dateFormatPattern)}
        </ListItem.Title>
        <ListItem.Subtitle>
          {formatCurrency(
            item.items?.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0,
            ),
          )}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Text style={styles.status}>{item.status}</Text>
    </ListItem>
  );
}

const useStyles = makeStyles((theme, status: Order['status']) => {
  const { colors } = theme;
  function getBgColor() {
    switch (status) {
      case Status.INPROGRESS:
        return colors.primary;
      case Status.CANCELED:
        return colors.error;
      case Status.COMPLETED:
        return colors.success;
      case Status.CREATED:
        return colors.grey3;
    }
  }

  return {
    avt: {
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    status: {
      backgroundColor: getBgColor(),
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      color: theme.colors.white,
      borderRadius: theme.spacing.lg,
      marginTop: theme.spacing.xs,
      fontSize: 14,
      alignSelf: 'flex-start',
    },
    chevron: {
      padding: theme.spacing.sm,
    },
    orderIndex: {
      fontWeight: 'bold',
      fontSize: 18,
    },
  };
});

export default memo(OrderItem);
