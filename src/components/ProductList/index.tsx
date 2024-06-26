import { Text, makeStyles } from '@rneui/themed';
import { SectionList, SectionListData } from 'react-native';
import ProductItem from './ProductItem';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';

type ItemCb = (prod: Product) => void;

type Props = {
  data: Category[];
  onItemPress: ItemCb;
  increaseQty?: ItemCb;
  decreaseQty?: ItemCb;
  isOrder?: boolean;
  getQty?: (prod: Product) => number;
};

function ProductList({
  data,
  onItemPress,
  getQty,
  increaseQty,
  decreaseQty,
  isOrder,
}: Props) {
  const styles = useStyles();
  return (
    <SectionList<Product, Category>
      keyExtractor={item => item.id.toString()}
      renderSectionHeader={({ section }) => {
        return (
          <Text bold h4 style={styles.sectionTitle}>
            {section.name}
          </Text>
        );
      }}
      sections={
        data.map(({ products: data, ...cat }) => ({
          ...cat,
          data,
        })) as unknown as SectionListData<Product, Category>[]
      }
      renderItem={({ item }) => {
        return (
          <ProductItem
            item={item}
            onPress={onItemPress}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
            qty={getQty?.(item)}
            shouldDisplayQty={isOrder}
          />
        );
      }}
    />
  );
}

export default ProductList;

const useStyles = makeStyles(theme => ({
  sectionTitle: {
    marginLeft: theme.spacing.lg,
    marginTop: theme.spacing.lg * 2,
    marginBottom: theme.spacing.lg,
  },
}));
