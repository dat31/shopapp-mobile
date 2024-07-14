import { View } from '@/components';
import { Order } from '@/models/Order';
import { Text, makeStyles } from '@rneui/themed';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

type Props = {
  order: Order;
};

function OrderInformation({ order }: Props) {
  const styles = useStyles();
  const { table, creator, orderDate, status } = order || {};
  const { t } = useTranslation();
  return (
    <>
      <View p-lg style={styles.root}>
        <Text h4 style={styles.orderInfo}>
          {t('common.information')}
        </Text>
        <View row space-between>
          <Text>{t('order.time')}</Text>
          <Text>{format(new Date(orderDate as string), 'MM/dd HH:mm')}</Text>
        </View>

        <View row space-between>
          <Text>{t('order.table')} </Text>
          <Text>{table}</Text>
        </View>

        <View row space-between>
          <Text>{t('order.creator')} </Text>
          <Text>{creator.name}</Text>
        </View>

        <View row space-between>
          <Text>{t('order.status.label')} </Text>
          <Text>{t(`order.status.${status.toLocaleLowerCase()}`)}</Text>
        </View>
      </View>
      <Text h4 style={[styles.orderInfo, styles.orderProds]}>
        {t('products.label')}
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
    paddingLeft: spacing.lg,
    marginTop: spacing.lg,
  },
}));
