import { Order, Status } from '@/models/Order';
import { Avatar, ListItem, makeStyles } from '@rneui/themed';
import { format } from 'date-fns';
import { TouchableHighlight } from 'react-native';

type Props = {
  item: Order;
  onPress: (item: Order) => void;
};

function OrderItem({ item, onPress }: Props) {
  const styles = useStyles(item.status);

  return (
    <ListItem
      Component={TouchableHighlight}
      onPress={() => {
        onPress(item);
      }}>
      <Avatar
        title={item.id.toString()}
        size={40}
        containerStyle={styles.avt}
      />
      <ListItem.Content>
        <ListItem.Title>
          {format(new Date(item.orderDate), 'HH:mm')}
        </ListItem.Title>
        <ListItem.Subtitle style={styles.status}>
          {item.status}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron
        style={styles.chevron}
        onPress={() => {
          console.log('press');
        }}
      />
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
    },
    status: {
      backgroundColor: getBgColor(),
      paddingHorizontal: theme.spacing.sm,
      color: theme.colors.white,
      borderRadius: theme.spacing.xs,
      marginTop: theme.spacing.xs,
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

export default OrderItem;
