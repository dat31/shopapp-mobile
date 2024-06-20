import { Icon, IconProps } from '@rneui/themed';

type Props = IconProps;

function IconButton(props: IconProps) {
  return (
    <Icon
      type="ionicon"
      {...props}
      iconStyle={{ ...props.iconStyle, padding: 8 }}
      containerStyle={[
        props.containerStyle,
        {
          borderRadius: 32,
        },
      ]}
    />
  );
}

export default IconButton;
