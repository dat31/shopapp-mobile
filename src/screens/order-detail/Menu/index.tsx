import { IconButton } from '@/components';
import { useTranslation } from 'react-i18next';
import ContextMenu from 'react-native-context-menu-view';

type Props = {
  cancel: Function;
  complete: Function;
  edit: Function;
  tintColor: string;
};

function Menu({ cancel, complete, edit, tintColor }: Props) {
  const { t } = useTranslation();
  return (
    <ContextMenu
      dropdownMenuMode={true}
      actions={[
        { title: t('common.cancel') },
        { title: t('common.complete') },
        { title: t('common.edit') },
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
          case 2: {
            edit();
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
