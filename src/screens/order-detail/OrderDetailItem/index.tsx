import { QtyModifier } from '@/components';
import { OrderItem } from '@/models/Order';
import formatCurrency from '@/utils/format-currency';
import { Avatar, Text } from '@rneui/base';
import { Icon, ListItem, makeStyles, useTheme } from '@rneui/themed';
import { memo } from 'react';
import { Alert, TouchableHighlight, View } from 'react-native';

type Props = {
  item: OrderItem;
  onIncreaseQty: (item: OrderItem) => void;
  onDecreaseQty: (item: OrderItem) => void;
  onRemove: (item: OrderItem) => void;
};

function OrderDetailItem({
  item,
  onDecreaseQty,
  onIncreaseQty,
  onRemove,
}: Props) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { product, quantity } = item;

  function onDecreaseClick(item: OrderItem) {
    if (item.quantity === 1) {
      Alert.alert('Confirmation', 'Are you sure', [
        { text: 'OK', onPress: () => onDecreaseQty(item) },
        { text: 'Cancel' },
      ]);
    } else {
      onDecreaseQty(item);
    }
  }

  return (
    <ListItem.Swipeable
      rightWidth={48}
      rightStyle={styles.itemRight}
      rightContent={reset => (
        <Icon
          style={styles.deleteIcon}
          onPress={() => {
            Alert.alert('Confirmation', 'Are you sure', [
              {
                text: 'OK',
                onPress: () => {
                  onRemove(item);
                  reset();
                },
              },
              { text: 'Cancel' },
            ]);
          }}
          color={theme.colors.white}
          name="trash-outline"
          type="ionicon"
        />
      )}
      onPress={() => {}}
      Component={TouchableHighlight}>
      <Avatar
        containerStyle={styles.prodIcon}
        size={40}
        icon={{ name: 'tag', type: 'ionic' }}
      />
      <ListItem.Content>
        <ListItem.Title>{product.name}</ListItem.Title>
        <QtyModifier
          qty={item.quantity}
          onDecrease={() => onDecreaseClick(item)}
          onIncrease={() => onIncreaseQty(item)}
        />
      </ListItem.Content>
      <View style={{ alignItems: 'flex-end', gap: theme.spacing.sm }}>
        <Text>
          {formatCurrency(product.price)} x {quantity}
        </Text>
        <Text>{formatCurrency(product.price * quantity)}</Text>
      </View>
    </ListItem.Swipeable>
  );
}

const useStyles = makeStyles(theme => {
  return {
    prodIcon: {
      backgroundColor: theme.colors.grey2,
    },
    qtyModify: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    itemRight: {
      backgroundColor: theme.colors.error,
    },
    deleteIcon: {
      minHeight: '100%',
      justifyContent: 'center',
    },
  };
});

export default memo(OrderDetailItem);
