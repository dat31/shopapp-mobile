import { FullScreenLoading, SquareImg, View } from '@/components';
import { StackParamList } from '@/navigator/employee-stacks';
import { useEmployeeDetailQuery } from '@/query/queries/employees';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useStyles from './style';
import { Chip, Text } from '@rneui/themed';
import { useEffect } from 'react';
import Menu from './Menu';
import confirmDelete from '@/utils/confirm-delete';
import { ScrollView, TouchableOpacity } from 'react-native';

type Props = {} & NativeStackScreenProps<StackParamList, 'EmployeeDetail'>;

function EmployeeDetail({ route, navigation }: Props) {
  const { uid } = route.params;
  const { setOptions, navigate } = navigation;
  const { data, isLoading } = useEmployeeDetailQuery(uid);
  const styles = useStyles();
  const { displayName, phoneNumber, photoURL } = data || {};

  useEffect(() => {
    if (isLoading) {
      return;
    }
    setOptions({
      headerRight: ({ tintColor }) => {
        return (
          <Menu
            phoneNum={phoneNumber as string}
            tintColor={tintColor}
            onDelete={() => {
              confirmDelete(() => {}, displayName as string);
            }}
            onEdit={() => {
              navigation.navigate('EmployeeEdit', { uid });
            }}
          />
        );
      },
    });
  }, [isLoading, setOptions, displayName]);

  function onSchedulesPress() {
    navigate('EmployeeSchedules', {});
  }

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <SquareImg style={styles.img} source={{ uri: photoURL as string }} />
      <View p-xl white>
        <Text h4 bold style={styles.sectionTitle}>
          Information
        </Text>
        <Text>{displayName}</Text>
        <Text>{phoneNumber}</Text>
      </View>
      <View ph-xl pb-xl white>
        <View space-between row>
          <Text h4 bold style={styles.sectionTitle}>
            Schedule
          </Text>
          <TouchableOpacity onPress={onSchedulesPress}>
            <Text style={{}}>Details</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text>Start time: 8h</Text>
          <Text>End time: </Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default EmployeeDetail;
