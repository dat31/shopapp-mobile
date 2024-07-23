import { Text, makeStyles } from '@rneui/themed';
import { SectionList, SectionListData, SectionListProps } from 'react-native';
import ProductItem from './ProductItem';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';

type ItemCb = (prod: Product) => void;

type Props = {
  data: Product[];
  onItemPress: ItemCb;
  increaseQty?: ItemCb;
  decreaseQty?: ItemCb;
  isOrder?: boolean;
  getQty?: (prod: Product) => number;
} & Omit<SectionListProps<Product, Category>, 'sections'>;

function ProductList({
  data,
  onItemPress,
  getQty,
  increaseQty,
  decreaseQty,
  isOrder,
  ...props
}: Props) {
  const styles = useStyles();
  const { t } = useTranslation();

  const groupedByCategory = useMemo(() => {
    const categories = (data as Product[]).reduce<Category[]>(
      (acc, product) => {
        if (
          acc.findIndex(category => isEqual(category, product.category)) !== -1
        ) {
          return acc;
        }
        return [...acc, product.category];
      },
      [],
    );
    return categories.map(category => ({
      ...category,
      data: (data as Product[]).filter(product =>
        isEqual(product.category, category),
      ),
    }));
  }, [data]);

  return (
    <SectionList<Product, Category>
      keyExtractor={item => item.id.toString()}
      renderSectionHeader={({ section }) => {
        return (
          <Text bold h4 style={styles.sectionTitle}>
            {section.name ?? t('category.uncategorized')}
          </Text>
        );
      }}
      sections={
        groupedByCategory as unknown as SectionListData<Product, Category>[]
      }
      renderItem={({ item }) => {
        return (
          <ProductItem
            item={item}
            onPress={onItemPress}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
            qty={getQty?.(item)}
          />
        );
      }}
      {...props}
    />
  );
}

export default memo(ProductList);

const useStyles = makeStyles(theme => ({
  sectionTitle: {
    marginLeft: theme.spacing.lg,
    marginTop: theme.spacing.lg * 2,
    marginBottom: theme.spacing.lg,
  },
}));
