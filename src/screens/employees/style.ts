import { makeStyles } from '@rneui/themed';

export default makeStyles(theme => ({
  statusContainer: {
    backgroundColor: theme.colors.success,

    borderRadius: theme.spacing.md,
  },
  statusText: {
    color: theme.colors.white,
    fontSize: theme.spacing.lg,
  },
}));
