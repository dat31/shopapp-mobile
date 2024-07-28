import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Picker, View } from '@/components';
import { useTranslation } from 'react-i18next';
import { Button, Input, makeStyles, useTheme } from '@rneui/themed';
import DateTimePicker from '@/screens/order-edit/DateTimePicker';
import { OrderFilter, Status } from '@/models/Order';
import { defaultFilter, statusOptions } from '@/constants/order';
import { endOfDay, format, startOfDay } from 'date-fns';

type Props = {
  onSubmit(filter: Partial<OrderFilter>): void;
  filter: Partial<OrderFilter>;
};

const Filter = forwardRef<BottomSheet, Props>(
  ({ onSubmit, filter: propsFilter }, ref) => {
    const [filter, setFilter] = useState<OrderFilter>(defaultFilter);
    const { theme } = useTheme();
    const handleSheetChanges = useCallback(
      (index: number) => {
        console.log('handleSheetChanges', index);
        if (index === -1) {
          console.log(propsFilter);
          setFilter(propsFilter);
        }
      },
      [propsFilter],
    );
    const snaps = useMemo(() => [488], []);
    const renderBackDrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          style={{ flex: 1 }}
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );
    const { t } = useTranslation();
    const styles = useStyles();
    const { from, to, table, status = null } = filter;

    return (
      <BottomSheet
        enableDynamicSizing={true}
        style={{ flex: 1 }}
        backdropComponent={renderBackDrop}
        index={-1}
        snapPoints={snaps}
        enablePanDownToClose
        ref={ref}
        onChange={handleSheetChanges}>
        <BottomSheetView style={styles.contentContainer}>
          <DateTimePicker
            label="From"
            inputProps={{
              renderErrorMessage: false,
              value: format(from as Date, 'yyyy-MM-dd'),
            }}
            value={from as Date}
            onChange={from => {
              setFilter(prev => ({ ...prev, from }));
            }}
            pickerProps={{ mode: 'date' }}
          />
          <DateTimePicker
            label="To"
            inputProps={{
              renderErrorMessage: false,
              value: format(to as Date, 'yyyy-MM-dd'),
            }}
            value={to as Date}
            onChange={to => {
              setFilter(prev => ({ ...prev, to }));
            }}
            pickerProps={{ mode: 'date' }}
          />
          <Input
            clearButtonMode="always"
            onChangeText={table => {
              setFilter(prev => ({ ...prev, table }));
            }}
            value={table}
            label={t('order.table')}
            renderErrorMessage={false}
          />
          <Picker<(typeof statusOptions)[0]>
            value={status}
            getValue={item => item.value}
            getLabel={item => item.label}
            data={statusOptions}
            label={t('order.status.label')}
            onChange={status => {
              setFilter(prev => ({ ...prev, status }));
            }}
          />
          <Button
            titleStyle={{ color: theme.colors.error }}
            type="clear"
            onPress={() => {
              setFilter(defaultFilter);
            }}>
            {t('common.clear_search')}
          </Button>
          <Button
            onPress={() => {
              onSubmit(filter);
            }}>
            {t('common.search')}
          </Button>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

const useStyles = makeStyles(({ spacing }) => ({
  contentContainer: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
}));

export default Filter;
