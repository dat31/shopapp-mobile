import { PickerSelect } from '@/components';
import { Order, Status } from '@/models/Order';
import { User } from '@/models/User';
import { StackParamList } from '@/navigator/order-stacks';
import { useEmployeesQuery } from '@/query/queries/employees';
import { useOrderDetailQuery } from '@/query/queries/orders';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, makeStyles } from '@rneui/themed';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import DateTimePicker from './DateTimePicker';
import { useCreateMutation, useUpdateMutation } from '@/query/mutations/orders';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import storage from '@/services/storage';
import { StackActions } from '@react-navigation/native';

type Props = NativeStackScreenProps<StackParamList, 'OrderEdit'>;

export default function OrderEdit({ route, navigation }: Props) {
  const styles = useStyles();
  const { mutate: updateMutate, isLoading: isLoadingUpdate } =
    useUpdateMutation();
  const { mutate: createMutate, isLoading: isLoadingCreate } =
    useCreateMutation();

  const { setValues, values, handleChange, handleSubmit, setFieldValue } =
    useFormik<Order>({
      initialValues: {
        status: Status.CREATED,
        orderDate: new Date().toISOString(),
        creator: storage.getUser(),
      } as unknown as Order,
      onSubmit(values) {
        if (values.id) {
          updateMutate(values, {
            onSuccess() {
              navigation.canGoBack() && navigation.goBack();
            },
          });
          return;
        }

        createMutate(values, {
          onSuccess(data) {
            navigation.dispatch(
              StackActions.replace('OrderDetail', { orderId: data.id }),
            );
          },
        });
      },
    });
  useOrderDetailQuery(route.params?.orderId as number, {
    onSuccess: setValues,
  });
  const { data: employees = [] } = useEmployeesQuery();
  const { t: tStatus } = useTranslation(undefined, {
    keyPrefix: 'order.status',
  });
  const { t } = useTranslation();
  const { status, orderDate, creator, table } = values;

  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.form}>
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
        <Input
          label="Table"
          value={table}
          onChangeText={handleChange('table')}
        />
        <PickerSelect<User>
          label={t('order.creator')}
          getKey={item => item.id.toString()}
          value={creator}
          onChange={value => setFieldValue('creator', value)}
          getLabel={item => item?.name}
          options={employees}
        />
        <Button
          loading={isLoadingUpdate || isLoadingCreate}
          onPress={handleSubmit as any}>
          {t('common.ok')}
        </Button>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  form: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
}));
