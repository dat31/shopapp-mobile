import { View } from '@/components';
import useEmployeesQuery from '@/query/queries/employees/useEmployeesQuery';
import { Avatar, ListItem, Text } from '@rneui/themed';
import { FlatList, TouchableHighlight } from 'react-native';
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
    navigate('EmployeeDetail', { id: item.id, name: item.name });
  }

  function onDelete(item: User) {
    confirmDelete(() => {
      mutate(item.id);
    }, item.name);
  }

  function onEdit(item: User) {
    navigate('EmployeeEdit', { id: item.id });
  }

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Menu
            phoneNum={item.phone as string}
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
                source={{
                  uri: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
                }}
                size={40}
                icon={{
                  name: 'person',
                  type: 'ionicon',
                  color: 'black',
                }}
              />
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.role}</ListItem.Subtitle>
              </ListItem.Content>
              <View pv-sm ph-md style={styles.statusContainer}>
                <Text style={styles.statusText}>available</Text>
              </View>
            </ListItem>
          </Menu>
        )}
      />
    </View>
  );
}

export default Employees;
