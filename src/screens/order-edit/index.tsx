import { PickerSelect, View } from '@/components';
import { Order, Status } from '@/models/Order';
import { User } from '@/models/User';
import { StackParamList } from '@/navigator/order-stacks';
import { useEmployeesQuery } from '@/query/queries/employees';
import { useOrderDetailQuery } from '@/query/queries/orders';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, makeStyles, useTheme } from '@rneui/themed';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import DateTimePicker from './DateTimePicker';
import { useUpdateMutation } from '@/query/mutations/orders';

type Props = NativeStackScreenProps<StackParamList, 'OrderEdit'>;

export default function OrderEdit({ route, navigation }: Props) {
  const styles = useStyles();
  const { mutate, isLoading: isLoadingUpdate } = useUpdateMutation();
  const { setValues, values, handleChange, handleSubmit, setFieldValue } =
    useFormik<Order>({
      initialValues: {} as Order,
      onSubmit(values) {
        mutate(values, {
          onSuccess() {
            navigation.canGoBack() && navigation.goBack();
          },
        });
      },
    });
  useOrderDetailQuery(route.params?.orderId, {
    onSuccess: setValues,
  });
  const { data: employees = [] } = useEmployeesQuery();
  const { t: tStatus } = useTranslation(undefined, {
    keyPrefix: 'order.status',
  });
  const { t } = useTranslation();
  const { status, orderDate, creator, table } = values;
  const { theme } = useTheme();

  return (
    <View ph-lg pv-xl style={styles.form}>
      <DateTimePicker
        value={orderDate}
        onChange={date => setFieldValue('orderDate', date)}
      />
      <PickerSelect<Status>
        label={t('order.status.label')}
        value={status}
        onChange={handleChange('status')}
        getLabel={item => tStatus(item?.toLocaleLowerCase())}
        getKey={item => item}
        options={[
          Status.CANCELED,
          Status.COMPLETED,
          Status.INPROGRESS,
          Status.CREATED,
        ]}
      />
      <Input label="Table" value={table} onChangeText={handleChange('table')} />
      <PickerSelect<User>
        label={t('order.creator')}
        getKey={item => item.id.toString()}
        value={creator}
        onChange={value => setFieldValue('creator', value)}
        getLabel={item => item?.name}
        options={employees}
      />
      <Button color={theme.colors.error}>{t('common.discard')}</Button>
      <Button loading={isLoadingUpdate} onPress={handleSubmit as any}>
        {t('common.ok')}
      </Button>
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  form: {
    gap: spacing.lg,
  },
}));
