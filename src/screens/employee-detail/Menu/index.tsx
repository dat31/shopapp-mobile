import { IconButton } from '@/components';
import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import ContextMenu from 'react-native-context-menu-view';

type Props = {
  tintColor?: HeaderButtonProps['tintColor'];
  onEdit: Function;
  onDelete: Function;
  dropdownMenuMode?: boolean;
  children?: ReactNode;
  phoneNum: string;
};

function Menu({
  tintColor,
  onEdit,
  onDelete,
  children,
  dropdownMenuMode = true,
  phoneNum,
}: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: 'common' });
  return (
    <ContextMenu
      dropdownMenuMode={dropdownMenuMode}
      actions={[
        { title: t('edit') },
        { title: t('delete') },
        { title: t('call'), disabled: !phoneNum },
      ]}
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
          case 2: {
            Linking.openURL(`tel:${phoneNum}`);
            break;
          }
          default:
            break;
        }
      }}>
      {children ? (
        children
      ) : (
        <IconButton
          onPress={() => {}}
          name="menu-outline"
          size={24}
          color={tintColor}
        />
      )}
    </ContextMenu>
  );
}

export default Menu;
