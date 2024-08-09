import { FullScreenLoading, Picker, DateTimePicker, View } from '@/components';
import { Order, Status } from '@/models/Order';
import { User } from '@/models/User';
import { StackParamList } from '@/navigator/order-stacks';
import { useEmployeesQuery } from '@/query/queries/employees';
import { useOrderDetailQuery } from '@/query/queries/orders';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, makeStyles } from '@rneui/themed';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useCreateMutation, useUpdateMutation } from '@/query/mutations/orders';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { StackActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { statusOptions } from '@/constants/order';
import { pick } from 'lodash';
import { useCallback } from 'react';

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
        creator: mapUserToSelectOption(auth().currentUser as User) as User,
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
  const { isFetching } = useOrderDetailQuery(route.params?.orderId as number, {
    onSuccess({ creator, ...data }) {
      setValues({ creator: mapUserToSelectOption(creator), ...data });
    },
  });
  const { data: employees = [] } = useEmployeesQuery();
  const { t } = useTranslation();
  const { status, orderDate, creator, table } = values;

  const getCreatorSelectionLabel = useCallback((user: User) => {
    if (user.uid === auth().currentUser?.uid) {
      return user.displayName?.concat(` (You)`) as string;
    }
    return user.displayName as string;
  }, []);

  if (isFetching) {
    return <FullScreenLoading />;
  }

  return (
    <ScrollView>
      <KeyboardAvoidingView>
        <View style={styles.form}>
          <DateTimePicker
            label={t('order.time')}
            value={new Date(orderDate)}
            onChange={date => setFieldValue('orderDate', date)}
          />
          <Picker
            getValue={v => v.value}
            data={statusOptions}
            getLabel={item => item.label}
            onChange={v => setFieldValue('status', v)}
            label={t('order.status.label')}
            value={status}
          />
          <Input
            inputStyle={{ backgroundColor: 'white' }}
            label="Table"
            value={table}
            onChangeText={handleChange('table')}
          />
          <Picker<User>
            getValue={v => mapUserToSelectOption(v)}
            data={employees.concat([
              mapUserToSelectOption(auth().currentUser as User),
            ])}
            getLabel={getCreatorSelectionLabel}
            onChange={v => {
              setFieldValue('creator', v);
            }}
            label={t('order.creator')}
            value={creator}
          />
          <Button
            loading={isLoadingUpdate || isLoadingCreate}
            onPress={handleSubmit as any}>
            {t('common.ok')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

function mapUserToSelectOption(user: User) {
  return pick(user, 'uid', 'displayName') as User;
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  form: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
  },
}));
