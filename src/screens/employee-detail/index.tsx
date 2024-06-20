import { FullScreenLoading, View } from '@/components';
import { StackParamList } from '@/navigator/employee-stacks';
import { useEmployeeDetailQuery } from '@/query/queries/employees';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useStyles from './style';
import { Image, Text } from '@rneui/themed';
import { useEffect } from 'react';
import Menu from './Menu';
import confirmDelete from '@/utils/confirm-delete';

type Props = {} & NativeStackScreenProps<StackParamList, 'EmployeeDetail'>;

function EmployeeDetail({ route, navigation }: Props) {
  const { id } = route.params;
  const { setOptions } = navigation;
  const { data, isLoading } = useEmployeeDetailQuery(id);
  const styles = useStyles();
  const { name, phone, role } = data || {};

  useEffect(() => {
    if (isLoading) {
      return;
    }
    setOptions({
      headerRight: ({ tintColor }) => {
        return (
          <Menu
            phoneNum={phone as string}
            tintColor={tintColor}
            onDelete={() => {
              confirmDelete(() => {}, name as string);
            }}
            onEdit={() => {
              navigation.navigate('EmployeeEdit', { id });
            }}
          />
        );
      },
    });
  }, [isLoading, setOptions, name]);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <View>
      <Image
        style={styles.img}
        source={{
          uri: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
        }}>
        <View ph-lg pv-sm success style={{ borderRadius: 16, margin: 8 }}>
          <Text style={{ color: 'white', fontSize: 14 }}>Available</Text>
        </View>
      </Image>
      <View p-xl white mb-md>
        <Text h4 bold style={styles.sectionTitle}>
          Information
        </Text>
        <Text>{name}</Text>
        <Text>{phone}</Text>
        <Text>{role}</Text>
      </View>
      <View p-xl white>
        <Text h4 bold style={styles.sectionTitle}>
          Schedule
        </Text>
        <View>
          <Text>Start time: 8h</Text>
          <Text>End time: </Text>
        </View>
      </View>
    </View>
  );
}

export default EmployeeDetail;
