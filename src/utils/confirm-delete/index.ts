import { t } from 'i18next';
import { Alert } from 'react-native';

export default function confirmDelete(cb: Function, item: string) {
  Alert.alert(
    t('common.confirmation'),
    t('common.action_confirm', {
      action: t('common.delete'),
      item: ` ${item}`,
    }),
    [
      {
        text: t('common.yes'),
        onPress: () => cb(),
      },
      {
        text: t('common.no'),
      },
    ],
  );
}
