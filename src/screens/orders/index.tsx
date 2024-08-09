import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import OrderItem from './OrderItem';
import { Order, OrderFilter } from '@/models/Order';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '@/navigator/order-stacks';
import { useOrdersQuery } from '@/query/queries/orders';
import { Text, useTheme } from '@rneui/themed';
import { FullScreenLoading, ListEmptyComponent, View } from '@/components';
import useStyles from './styles';
import AdvancedFilter from './AdvancedFilter';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { useOrderStore } from './store';
import { useTranslation } from 'react-i18next';
import BasicFilter from './BasicFilter';
import { isSameDay } from 'date-fns';

type Props = NativeStackScreenProps<StackParamList, 'Orders'>;

function Orders({ navigation }: Props) {
  const { filter, setFilter, isRefreshing, setIsRefreshing } = useOrderStore();
  const { from, to } = filter;
  const { navigate, setOptions } = navigation;
  const {
    data,
    isFetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchedAfterMount,
    remove,
  } = useOrdersQuery(filter);
  const { theme } = useTheme();
  const styles = useStyles();
  const ref = useRef<BottomSheet>(null);
  const { t } = useTranslation();

  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (isFetchedAfterMount) {
        refetch();
      }
    });
  }, [isFetchedAfterMount, refetch]);

  useEffect(() => {
    return navigation.addListener('blur', () => {
      remove();
    });
  }, [remove]);

  useEffect(() => {
    setOptions({
      headerRight({ tintColor }) {
        return (
          <TouchableOpacity onPress={onCreate}>
            <Text style={{ color: tintColor }}>{t('common.create')}</Text>
          </TouchableOpacity>
        );
      },
    });
  }, [setOptions]);

  const orders = useMemo(() => {
    if (isFetching && !isRefreshing && !isFetchingNextPage) {
      // return empty array to display ListEmptyComponent
      // isRefreshing: display <RefreshControl/> at top of list
      // isFetchingNextPage: display indicator at bottom of list
      return [];
    }
    if (!data?.pages) {
      return [];
    }
    return data?.pages?.reduce((acc, page) => acc.concat(page.data as any), []);
  }, [data, isFetching, isRefreshing]);

  const dateFormatPattern = useMemo(() => {
    if (isSameDay(from as Date, to as Date)) {
      return 'HH:mm';
    }
    return 'MM-dd HH:mm';
  }, [from, to]);

  const onItemPress = useCallback((item: Order) => {
    navigate('OrderDetail', { orderId: item.id });
  }, []);

  function onCreate() {
    navigation.navigate('OrderEdit');
  }

  function showAdvancedFilter() {
    ref.current?.snapToIndex(0);
  }

  function onSubmitFilter(filter: OrderFilter) {
    setFilter(filter);
    ref.current?.close();
  }

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch().finally(() => {
      setIsRefreshing(false);
    });
  }, [refetch]);

  const onEndReached = useCallback(() => {
    hasNextPage && fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  return (
    <View flex-1 bg-white>
      <FlatList
        onEndReached={onEndReached}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <BasicFilter
            filter={filter}
            onChange={setFilter}
            onAdvancedFilterPress={showAdvancedFilter}
          />
        )}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View p-lg>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
        contentContainerStyle={styles.list}
        data={orders}
        ListEmptyComponent={() =>
          isFetching ? (
            <FullScreenLoading />
          ) : (
            <ListEmptyComponent text="Empty !" icon="receipt-outline" />
          )
        }
        renderItem={({ item }) => (
          <OrderItem
            dateFormatPattern={dateFormatPattern}
            item={item}
            onPress={onItemPress}
          />
        )}
      />
      <AdvancedFilter ref={ref} onSubmit={onSubmitFilter} filter={filter} />
    </View>
  );
}

export default Orders;
