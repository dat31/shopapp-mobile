import { View } from '@/components';
import { User } from '@/models/User';
import { StackParamList } from '@/navigator/employee-stacks';
import { useUpdateEmployeeMutation } from '@/query/mutations/employees';
import { useEmployeeDetailQuery } from '@/query/queries/employees';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input } from '@rneui/themed';
import { useFormik } from 'formik';
import i18next from 'i18next';
import Toast from 'react-native-root-toast';
import * as yup from 'yup';

type Props = {} & NativeStackScreenProps<StackParamList, 'EmployeeEdit'>;

const validationSchema = yup.object().shape({
  name: yup.string().required(i18next.t('common.required_error')),
  phone: yup.string().required(i18next.t('common.required_error')),
});

function EmployeeEdit({ route, navigation }: Props) {
  const { mutate } = useUpdateEmployeeMutation();
  const { handleBlur, handleChange, setValues, values, handleSubmit, errors } =
    useFormik<User>({
      initialValues: {
        name: '',
        phone: '',
      } as User,
      validationSchema,
      onSubmit(values) {
        mutate(values, {
          onSuccess() {
            Toast.show('Update success');
            navigation.popToTop();
          },
        });
      },
      validateOnMount: false,
    });
  useEmployeeDetailQuery(route.params.id, {
    onSuccess: setValues,
  });
  const { name, phone } = values;
  return (
    <View white ph-lg pv-xl>
      <Input
        onBlur={handleBlur('name')}
        onChangeText={handleChange('name')}
        label="Name"
        value={name}
        errorMessage={errors.name}
      />
      <Input
        onBlur={handleBlur('phone')}
        onChangeText={handleChange('phone')}
        label="Phone"
        value={phone}
        errorMessage={errors.phone}
      />
      <View ph-md mt-xl>
        <Button onPress={handleSubmit as any}>Submit</Button>
      </View>
    </View>
  );
}

export default EmployeeEdit;
