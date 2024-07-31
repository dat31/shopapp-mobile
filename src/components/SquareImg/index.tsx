import { Image, ImageProps, useTheme } from '@rneui/themed';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import {
  ImageURISource,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';
import View from '../View';
import { isFunction } from 'lodash';
import ContextMenu, {
  ContextMenuOnPressNativeEvent,
} from 'react-native-context-menu-view';
import IconButton from '../IconButton';
import { useTranslation } from 'react-i18next';

type Props = ImageProps & { source: ImageURISource } & {
  children?: ReactElement;
  onEdit?: (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => void;
};

export default function SquareImg(props: Props) {
  const [size, setSize] = useState<{ width: number; height: number }>(
    {} as any,
  );
  const { width } = useWindowDimensions();
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();
  const { onEdit } = props;

  useEffect(() => {
    setSize({
      width,
      height: width,
    });
  }, [width]);

  const children = useMemo(
    () =>
      isFunction(onEdit) ? (
        <ContextMenu
          onPress={onEdit}
          dropdownMenuMode
          actions={[
            { title: t('common.take_picture') },
            { title: t('common.choose_from_library') },
          ]}>
          <IconButton
            onLongPress={() => {}}
            color={colors.white}
            name="pencil"
            containerStyle={{ backgroundColor: colors.primary }}
          />
        </ContextMenu>
      ) : null,
    [onEdit],
  );

  if (!props.source) {
    return (
      <View
        children={children}
        {...props}
        style={[
          {
            backgroundColor: colors.grey4,
          },
          props.style,
          size,
        ]}
      />
    );
  }

  return (
    <Image
      children={children}
      containerStyle={{
        backgroundColor: colors.grey4,
      }}
      {...props}
      style={[props.style, size, { objectFit: 'cover' }]}
    />
  );
}
