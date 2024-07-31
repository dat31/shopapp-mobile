import { makeStyles } from '@rneui/themed';

const useStyles = makeStyles(theme => {
  return {
    img: {
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      padding: theme.spacing.lg,
    },
    desc: {
      color: theme.colors.grey2,
    },
    sectionTitle: {
      marginBottom: theme.spacing.sm,
    },
  };
});

export default useStyles;
