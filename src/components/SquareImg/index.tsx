import { Image, ImageProps, useTheme } from '@rneui/themed';
import { ReactElement, useEffect, useState } from 'react';
import { ImageURISource, useWindowDimensions } from 'react-native';
import View from '../View';

type Props = ImageProps & { source: ImageURISource } & {
  children?: ReactElement;
};

export default function SquareImg(props: Props) {
  const [size, setSize] = useState<{ width: number; height: number }>(
    {} as any,
  );
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  useEffect(() => {
    setSize({
      width,
      height: width,
    });
  }, [width]);

  if (!props.source) {
    return (
      <View
        {...props}
        style={[
          {
            backgroundColor: theme.colors.grey3,
          },
          props.style,
          size,
        ]}
      />
    );
  }

  return (
    <Image
      containerStyle={{
        backgroundColor: theme.colors.grey3,
      }}
      {...props}
      style={[props.style, size, { objectFit: 'cover' }]}
    />
  );
}
