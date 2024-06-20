import { IconButton } from '@/components';
import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import ContextMenu from 'react-native-context-menu-view';

type Props = {
  tintColor: HeaderButtonProps['tintColor'];
  onEdit: Function;
  onDelete: Function;
};

function Menu({ tintColor, onEdit, onDelete }: Props) {
  return (
    <ContextMenu
      dropdownMenuMode={true}
      actions={[{ title: 'Edit' }, { title: 'Delete' }]}
      onPress={e => {
        switch (e.nativeEvent.index) {
          case 0: {
            onEdit();
            break;
          }
          case 1: {
            onDelete();
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
