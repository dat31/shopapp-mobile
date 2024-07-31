import { FullScreenLoading, SquareImg, View } from '@/components';
import { User } from '@/models/User';
import { StackParamList } from '@/navigator/employee-stacks';
import { useUpdateEmployeeMutation } from '@/query/mutations/employees';
import { useEmployeeDetailQuery } from '@/query/queries/employees';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, makeStyles } from '@rneui/themed';
import { useFormik } from 'formik';
import { isEqual } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView } from 'react-native';
import { NativeSyntheticEvent, Platform, ScrollView } from 'react-native';
import { ContextMenuOnPressNativeEvent } from 'react-native-context-menu-view';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-root-toast';
import * as yup from 'yup';

type Props = {} & NativeStackScreenProps<StackParamList, 'EmployeeEdit'>;

function EmployeeEdit({ route, navigation }: Props) {
  const { mutate, isLoading } = useUpdateEmployeeMutation();
  const { t } = useTranslation();
  const styles = useStyles();
  const [uri, setUri] = useState<string>();
  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        displayName: yup.string().required(t('errors.required_error')),
        phoneNumber: yup.string().required(t('errors.required_error')),
      }),
    [t],
  );
  const {
    handleBlur,
    handleChange,
    setValues,
    values,
    handleSubmit,
    errors,
    setFormikState,
    status,
    touched,
    submitCount,
    setFieldValue,
  } = useFormik<User>({
    initialValues: {
      displayName: '',
      phoneNumber: '',
    } as User,
    validateOnMount: false,
    validationSchema,
    onSubmit(values) {
      if (isEqual(status.initialData, values)) {
        return navigation.popToTop();
      }
      mutate(values, {
        onSuccess() {
          Toast.show('Update success');
          navigation.popToTop();
        },
      });
    },
  });

  const onGetEmployeeDetailSuccess = useCallback(
    (data: User) => {
      setFormikState(state => ({
        ...state,
        status: {
          initialData: data,
        },
      }));
      setValues(data);
      if (data.photoURL) {
        setUri(data.photoURL);
      }
    },
    [setFormikState, setValues, setUri],
  );

  const { isFetching, data } = useEmployeeDetailQuery(route.params.uid, {
    onSuccess: onGetEmployeeDetailSuccess,
  });

  function getFieldError(field: keyof User) {
    return (submitCount > 0 || touched[field] ? errors[field] : '') as string;
  }

  const onEdit = useCallback(
    (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
      const fn = e.nativeEvent.index === 0 ? launchCamera : launchImageLibrary;
      fn({ mediaType: 'photo' }, result => {
        const [img] = result?.assets || [];
        if (!img) {
          return;
        }
        setFieldValue('photoURL', {
          ...img,
          fileName: data?.uid.concat(
            img.fileName?.substring(img.fileName.lastIndexOf('.')) as string,
          ),
        });
        setUri(img.uri as string);
      });
    },
    [setFieldValue, setUri],
  );

  if (isFetching) {
    return <FullScreenLoading />;
  }

  const { displayName, phoneNumber } = values;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 70}
      enabled>
      <ScrollView style={styles.root}>
        <SquareImg source={{ uri }} style={styles.img} onEdit={onEdit} />
        <View ph-lg pv-xl>
          <Input
            inputContainerStyle={{
              marginBottom: 0,
              paddingBottom: 0,
            }}
            onBlur={handleBlur('displayName')}
            onChangeText={handleChange('displayName')}
            label="Name"
            value={displayName as string}
            errorMessage={getFieldError('displayName')}
          />
          <Input
            onBlur={handleBlur('phoneNumber')}
            onChangeText={handleChange('phoneNumber')}
            label="Phone"
            value={phoneNumber as string}
            errorMessage={getFieldError('phoneNumber')}
          />
          <View ph-md mt-xl>
            <Button
              loading={isLoading}
              disabled={isLoading}
              onPress={handleSubmit as any}>
              {t('common.ok')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  root: {
    backgroundColor: colors.white,
  },
  editImgBtn: {
    backgroundColor: colors.primary,
  },
  img: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: spacing.lg,
  },
}));

export default EmployeeEdit;
