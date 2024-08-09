import i18n from '@/i18n';
import { OrderFilter, Status } from '@/models/Order';
import { endOfDay, endOfWeek, startOfDay, startOfWeek } from 'date-fns';

export const statusOptions = [
  Status.CREATED,
  Status.INPROGRESS,
  Status.COMPLETED,
  Status.CANCELED,
].map(value => ({
  value,
  label: i18n.t('order.status.'.concat(value.toLocaleLowerCase())),
}));

export const filterToDay = {
  from: startOfDay(new Date()),
  to: endOfDay(new Date()),
};

export const filterThisWeek: OrderFilter = {
  from: startOfWeek(new Date(), { weekStartsOn: 1 }),
  to: endOfWeek(new Date(), { weekStartsOn: 1 }),
};

export const defaultFilter: OrderFilter = {
  ...filterToDay,
  order: { orderDate: 'desc' },
};
