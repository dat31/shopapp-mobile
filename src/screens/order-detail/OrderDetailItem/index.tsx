import { QtyModifier } from '@/components';
import { OrderItem } from '@/models/Order';
import confirmDelete from '@/utils/confirm-delete';
import formatCurrency from '@/utils/format-currency';
import { Avatar, Text } from '@rneui/base';
import { Icon, ListItem, makeStyles, useTheme } from '@rneui/themed';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  NativeSyntheticEvent,
  TouchableHighlight,
  View,
} from 'react-native';
import ContextMenu, {
  ContextMenuOnPressNativeEvent,
} from 'react-native-context-menu-view';

type ItemCb = (item: OrderItem) => void;

type Props = {
  item: OrderItem;
  onIncreaseQty: ItemCb;
  onDecreaseQty: ItemCb;
  onRemove: ItemCb;
  onPress: ItemCb;
};

function OrderDetailItem({
  item,
  onDecreaseQty,
  onIncreaseQty,
  onRemove,
  onPress,
}: Props) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { product, quantity } = item;
  const { t } = useTranslation();

  function handleCtxMenu(
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
  ) {
    switch (e.nativeEvent.index) {
      case 0: {
        confirmDelete(() => onRemove(item), item.product.name);
        break;
      }
      case 1: {
        onPress(item);
        break;
      }
      default:
        break;
    }
  }

  return (
    <ContextMenu
      onPress={handleCtxMenu}
      dropdownMenuMode={false}
      actions={[{ title: t('common.delete') }, { title: t('common.detail') }]}>
      <ListItem
        onPress={() => {
          onPress(item);
        }}
        onLongPress={() => {
          //empty fn to fix context menu long press conflict
        }}
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
            onDecrease={() => onDecreaseQty(item)}
            onIncrease={() => onIncreaseQty(item)}
          />
        </ListItem.Content>
        <View style={{ alignItems: 'flex-end', gap: theme.spacing.sm }}>
          <Text>
            {formatCurrency(product.price)} x {quantity}
          </Text>
          <Text>{formatCurrency(product.price * quantity)}</Text>
        </View>
      </ListItem>
    </ContextMenu>
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
