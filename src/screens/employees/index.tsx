import { View } from '@/components';
import useEmployeesQuery from '@/query/queries/employees/useEmployeesQuery';
import { Avatar, ListItem, Text } from '@rneui/themed';
import {
  FlatList,
  ImageSourcePropType,
  TouchableHighlight,
} from 'react-native';
import useStyles from './style';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '@/navigator/employee-stacks';
import { User } from '@/models/User';
import Menu from '../employee-detail/Menu';
import confirmDelete from '@/utils/confirm-delete';
import { useDeleteEmployeeMutation } from '@/query/mutations/employees';

type Props = {} & NativeStackScreenProps<StackParamList, 'Employees'>;

function Employees({ navigation }: Props) {
  const { data } = useEmployeesQuery();
  const styles = useStyles();
  const { navigate } = navigation;
  const { mutate } = useDeleteEmployeeMutation();

  function onItemPress(item: User) {
    console.log(item.uid);
    navigate('EmployeeDetail', {
      uid: item.uid,
      displayName: item.displayName,
    });
  }

  function onDelete(item: User) {
    confirmDelete(() => {
      mutate(item.uid);
    }, item.displayName as string);
  }

  function onEdit(item: User) {
    navigate('EmployeeEdit', { uid: item.uid });
  }

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          const { phoneNumber, displayName, photoURL: uri } = item;

          return (
            <Menu
              phoneNum={item.phoneNumber as string}
              onDelete={() => onDelete(item)}
              onEdit={() => onEdit(item)}
              dropdownMenuMode={false}>
              <ListItem
                onLongPress={() => {
                  //fix for context menu
                }}
                Component={TouchableHighlight}
                onPress={() => {
                  onItemPress(item);
                }}>
                <Avatar
                  source={
                    {
                      uri,
                    } as ImageSourcePropType
                  }
                  size={40}
                  icon={{
                    name: 'person',
                    type: 'ionicon',
                    color: 'black',
                  }}
                />
                <ListItem.Content>
                  <ListItem.Title>{displayName}</ListItem.Title>
                  <ListItem.Subtitle>{phoneNumber}</ListItem.Subtitle>
                </ListItem.Content>
                <View pv-sm ph-md style={styles.statusContainer}>
                  <Text style={styles.statusText}>available</Text>
                </View>
              </ListItem>
            </Menu>
          );
        }}
      />
    </View>
  );
}

export default Employees;
