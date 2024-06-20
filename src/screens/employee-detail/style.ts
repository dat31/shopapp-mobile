import { makeStyles } from '@rneui/themed';

const useStyles = makeStyles(theme => {
  return {
    img: {
      width: '100%',
      height: 256,
      objectFit: 'cover',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
    },
    desc: {
      color: theme.colors.grey2,
    },
    sectionTitle: {
      marginBottom: theme.spacing.md,
    },
  };
});

export default useStyles;
