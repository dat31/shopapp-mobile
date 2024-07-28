import { makeStyles } from '@rneui/themed';

const useStyles = makeStyles(({ spacing }) => {
  return {
    list: {
      flexGrow: 1,
    },
    chipsContainer: {
      paddingHorizontal: spacing.lg + spacing.xs,
      paddingVertical: spacing.lg,
      columnGap: spacing.lg,
    },
    chipBtn: {
      paddingHorizontal: spacing.lg,
    },
  };
});

export default useStyles;
