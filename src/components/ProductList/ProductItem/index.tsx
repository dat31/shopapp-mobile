import { QtyModifier } from '@/components';
import { Product } from '@/models/Product';
import formatCurrency from '@/utils/format-currency';
import { Avatar } from '@rneui/base';
import { ListItem, makeStyles } from '@rneui/themed';
import { TouchableHighlight } from 'react-native';

type Props = {
  item: Product;
  onPress: (prod: Product) => void;
  onDecrease?: (prod: Product) => void;
  onIncrease?: (prod: Product) => void;
  qty?: number;
};

function ProductItem({ item, onPress, onDecrease, onIncrease, qty }: Props) {
  const { name, price, imageUrl } = item;
  const styles = useStyles();
  return (
    <ListItem.Swipeable
      Component={TouchableHighlight}
      onPress={() => {
        onPress(item);
      }}>
      <Avatar
        {...(imageUrl ? { source: { uri: imageUrl } } : {})}
        containerStyle={styles.prodIcon}
        avatarStyle={{
          objectFit: 'cover',
        }}
        size={40}
        icon={{ name: 'tag', type: 'ionic' }}
      />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
        <ListItem.Subtitle>{formatCurrency(price)}</ListItem.Subtitle>
      </ListItem.Content>
      {qty !== undefined && onDecrease && onIncrease ? (
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
    backgroundColor: theme.colors.grey3,
  },
}));

export default ProductItem;
