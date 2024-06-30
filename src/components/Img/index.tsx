import { Image, ImageProps } from '@rneui/themed';
import { ReactElement, useEffect, useState } from 'react';
import { ImageURISource, useWindowDimensions } from 'react-native';

type Props = ImageProps & { source: ImageURISource } & {
  children: ReactElement;
};

export default function Img(props: Props) {
  const [size, setSize] = useState<{ width: number; height: number }>(
    {} as any,
  );
  const { source } = props;
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!source?.uri) {
      return;
    }
    Image.getSize(source.uri, (w, h) => {
      const ratio = width / w;
      setSize({
        width,
        height: h * ratio,
      });
    });
  }, [source, width]);

  return <Image {...props} style={[props.style, size]} />;
}
