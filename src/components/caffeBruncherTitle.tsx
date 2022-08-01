import { Typography } from '@mui/material';

const CaffeBruncherTitle = () => {
  return (
    <Typography
      variant='h1'
      align='center'
      sx={{
        fontWeight: '700',
        m: 8,
        fontSize: { xs: '3rem', md: '6rem' },
      }}
    >
      CaffeBruncher
    </Typography>
  );
};

export default CaffeBruncherTitle;
