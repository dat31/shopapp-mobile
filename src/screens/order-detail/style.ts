import { makeStyles } from '@rneui/themed';

const useStyles = makeStyles(({ spacing, colors }) => ({
  addButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  cancelBtn: {
    backgroundColor: colors.error,
  },
  completeBtn: {
    backgroundColor: colors.success,
  },
}));

export default useStyles;
