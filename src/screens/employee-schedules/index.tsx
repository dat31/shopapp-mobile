import { View } from '@/components';
import { Text } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import {
  addDays,
  endOfMonth,
  format,
  getDaysInMonth,
  intervalToDuration,
  startOfMonth,
} from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import {
  Calendar,
  Agenda,
  AgendaSchedule,
  DateData,
  AgendaEntry,
  CalendarList,
  ExpandableCalendar,
  CalendarProvider,
  AgendaList,
} from 'react-native-calendars';
import { TouchableOpacity } from 'react-native-gesture-handler';
function timeToString(time: number) {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}
function EmployeeSchedules() {
  const [dates, setDates] = useState({});

  const loadItems = useCallback((day: DateData) => {
    console.log(day);
    if (day.month > 7) {
      setDates({});
      return;
    }

    const numOfDays = getDaysInMonth(day.month);
    const startDate = startOfMonth(day.timestamp);
    const start =
      startDate.getMonth() === day.month ? startDate : addDays(startDate, 1);
    const dateData: AgendaSchedule = Array.from(
      Array(numOfDays + 1).keys(),
    ).reduce((acc, i) => {
      const day = addDays(start, i);

      const time = day.toISOString().split('T')[0];

      return {
        ...acc,
        [time]: [
          {
            name: {
              start: '08:15',
              end: '16:15',
            },
            height: 72,
            day: time,
          },
        ],
      };
    }, {});
    console.log(dateData);
    setDates(dateData);
  }, []);

  const renderItem = useCallback(
    (reservation: AgendaEntry, isFirst: boolean) => {
      const fontSize = isFirst ? 16 : 14;
      const color = isFirst ? 'black' : '#43515c';

      return (
        <View
          style={[
            {
              backgroundColor: 'white',
              flex: 1,
              borderRadius: 4,
              padding: 16,
              marginRight: 8,
              marginTop: 16,
            },
            { height: 72 },
          ]}>
          <Text style={{ fontSize, color }}>
            {(reservation.name as any).start} - {(reservation.name as any).end}
          </Text>

          <Text style={{ fontSize, color }}>Duration: 8h</Text>
        </View>
      );
    },
    [],
  );

  const markedDates = useMemo(() => {
    if (!dates) {
      return {};
    }
    return Object.keys(dates).reduce(
      (acc, date) => ({
        ...acc,
        [date]: { marked: true },
      }),
      {},
    );
  }, [dates]);

  // return (
  //   <View flex-1 bg-white>
  //     <CalendarProvider date="2024-07-01">
  //       <ExpandableCalendar
  //         firstDay={1}
  //         markedDates={{ '2024-07-31': { marked: true } }}
  //       />
  //       <AgendaList sections={[]} renderItem={renderItem} />
  //     </CalendarProvider>
  //   </View>
  // );

  return (
    <View flex-1 bg-white>
      <Agenda
        renderEmptyData={() => null}
        loadItemsForMonth={loadItems}
        markedDates={{}}
        items={dates}
        renderItem={renderItem}
      />
    </View>
  );
}

export default EmployeeSchedules;
