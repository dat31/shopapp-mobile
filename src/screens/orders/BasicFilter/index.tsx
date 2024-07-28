import useStyles from '../styles';
import { OrderFilter } from '@/models/Order';
import { Chip } from '@rneui/themed';
import { filterThisWeek, filterToDay } from '@/constants/order';
import { isEqual, pick } from 'lodash';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

type Props = {
  filter: OrderFilter;
  onChange(filter: OrderFilter): void;
  onAdvancedFilterPress(): void;
};

export default function BasicFilter({
  filter,
  onChange,
  onAdvancedFilterPress,
}: Props) {
  const styles = useStyles();
  const { t } = useTranslation();
  const isOrderDateAsc = filter.order?.orderDate === 'asc';
  const filterDate = pick(filter, ['from', 'to']);
  return (
    <ScrollView contentContainerStyle={styles.chipsContainer} horizontal>
      <Chip
        buttonStyle={styles.chipBtn}
        size="sm"
        onPress={onAdvancedFilterPress}
        iconRight
        icon={{ name: 'options', type: 'ionicon', color: 'white' }}
        title={t('common.filter')}
      />
      <Chip
        buttonStyle={styles.chipBtn}
        size="sm"
        onPress={() => {
          onChange({
            ...filter,
            order: {
              orderDate: isOrderDateAsc ? 'desc' : 'asc',
            },
          });
        }}
        iconRight
        icon={{
          name: isOrderDateAsc ? 'arrow-down' : 'arrow-up',
          type: 'ionicon',
          color: 'white',
        }}
        title={t('order.time')}
      />
    </ScrollView>
  );
}
