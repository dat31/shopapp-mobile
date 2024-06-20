import { StackParamList } from '@/navigator/product-stacks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, View as RNView } from 'react-native';
import { useProductDetailStore } from './store';
import { useCallback, useEffect } from 'react';
import { Image, Overlay, Text, makeStyles, useTheme } from '@rneui/themed';
import formatCurrency from '@/utils/format-currency';
import { Backdrop, FullScreenLoading, IconButton, View } from '@/components';
import { useProductDetailQuery } from '@/query/queries/products';
import Menu from './Menu';
import { useDeleteProdMutation } from '@/query/mutations/products';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-root-toast';

type Props = {} & NativeStackScreenProps<StackParamList, 'ProductDetail'>;

function ProductDetail(props: Props) {
  const {
    route,
    navigation: { setOptions, goBack, canGoBack },
  } = props;
  const { productId } = route.params;
  const { data, isLoading: isLoadingProdDetail } =
    useProductDetailQuery(productId);
  const { mutate: delMutate, isLoading: isLoadingDelete } =
    useDeleteProdMutation();
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const deleteProd = useCallback(() => {
    Alert.alert(
      t('common.confirmation'),
      t('common.action_confirm', {
        action: t('common.delete').toLocaleLowerCase(),
        item: ` ${data?.name}`,
      }),
      [
        {
          text: t('common.yes'),
          onPress() {
            delMutate(productId, {
              onSuccess() {
                Toast.show('Delete success');
                canGoBack() && goBack();
              },
            });
          },
        },
        { text: t('common.no') },
      ],
    );
  }, [productId, delMutate, data?.name]);

  useEffect(() => {
    setOptions({
      headerRight: ({ tintColor }) => {
        return (
          <Menu tintColor={tintColor} onDelete={deleteProd} onEdit={() => {}} />
        );
      },
    });
  }, [setOptions, deleteProd]);

  if (isLoadingProdDetail) {
    return <FullScreenLoading />;
  }

  if (!data) {
    return null;
  }

  const { name, price, description } = data;

  return (
    <View>
      <Overlay isVisible={isLoadingDelete}>
        <ActivityIndicator size={'large'} color={theme.colors.primary} />
      </Overlay>

      <Image
        style={styles.img}
        source={{
          uri: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
        }}
      />
      <View p-xl white>
        <View space-between row mb-md>
          <Text h4 bold>
            {name}
          </Text>
          <Text h4 bold>
            {formatCurrency(price)}
          </Text>
        </View>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles(theme => {
  return {
    img: {
      width: '100%',
      height: 256,
      objectFit: 'cover',
    },
    desc: {
      color: theme.colors.grey2,
    },
  };
});

export default ProductDetail;
