import { QtyModifier } from '@/components';
import { Product } from '@/models/Product';
import formatCurrency from '@/utils/format-currency';
import { Avatar } from '@rneui/base';
import { ListItem, makeStyles } from '@rneui/themed';
import { TouchableHighlight } from 'react-native';

type Props = {
  item: Product;
  onPress: (prod: Product) => void;
  shouldDisplayQty?: boolean;
  onDecrease?: (prod: Product) => void;
  onIncrease?: (prod: Product) => void;
  qty?: number;
};

function ProductItem({
  item,
  onPress,
  shouldDisplayQty,
  onDecrease,
  onIncrease,
  qty,
}: Props) {
  const { name, price } = item;
  const styles = useStyles();
  return (
    <ListItem.Swipeable
      Component={TouchableHighlight}
      onPress={() => {
        onPress(item);
      }}>
      <Avatar
        source={{
          uri: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
        }}
        containerStyle={styles.prodIcon}
        avatarStyle={{
          objectFit: 'cover',
        }}
        size={32}
        icon={{ name: 'tag', type: 'ionic' }}
      />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
        <ListItem.Subtitle>{formatCurrency(price)}</ListItem.Subtitle>
      </ListItem.Content>
      {shouldDisplayQty && onDecrease && onIncrease ? (
        <QtyModifier
          qty={qty as number}
          onIncrease={() => onIncrease(item)}
          onDecrease={() => onDecrease(item)}
        />
      ) : null}
    </ListItem.Swipeable>
  );
}

const useStyles = makeStyles(theme => ({
  prodIcon: {
    backgroundColor: theme.colors.grey2,
  },
}));

export default ProductItem;
