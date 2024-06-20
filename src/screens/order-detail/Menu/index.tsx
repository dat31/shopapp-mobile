import { IconButton } from '@/components';
import { Icon } from '@rneui/themed';
import ContextMenu from 'react-native-context-menu-view';

type Props = {
  cancel: Function;
  complete: Function;
  tintColor: string;
};

function Menu({ cancel, complete, tintColor }: Props) {
  return (
    <ContextMenu
      dropdownMenuMode={true}
      actions={[
        { title: 'Cancel', icon: 'ellipsis-vertical-outline' },
        { title: 'Complete', icon: 'ellipsis-vertical-outline' },
      ]}
      onPress={e => {
        switch (e.nativeEvent.index) {
          case 0: {
            cancel();
            break;
          }
          case 1: {
            complete();
            break;
          }
          default:
            break;
        }
      }}>
      <IconButton
        onPress={() => {}}
        name="menu-outline"
        size={24}
        color={tintColor}
      />
    </ContextMenu>
  );
}

export default Menu;
