import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const useStyles = makeStyles((theme) => ({
  card: {
    overflow: 'hidden',
    boxSizing: 'border-box',
    boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.2)',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
    width: '100%',
    height: '100%',
  },
  content: {
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  media: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: theme.palette.grey[500],
    marginTop: theme.spacing(1),
  },
  description: {
    fontSize: 16,
    color: theme.palette.grey[700],
    marginTop: theme.spacing(1),
  },
}));

const BHCards = ({ name, address, description, id, img }) => {
  const authContext = useContext(AuthContext);
  const classes = useStyles();
  const history = useNavigate();

  return (
    <>
      <Card className={classes.card}>
        {img ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 230,
              overflow: 'hidden',
            }}
          >
            <CardMedia
              component="img"
              image={img ? img : ''}
              alt={name}
              className={classes.media}
            />
          </Box>
        ) : (
          <Box>
            <Typography variant="body2">No image</Typography>
          </Box>
        )}

        <CardContent className={classes.content}>
          <Box>
            <Typography className={classes.title} variant="h5" component="h2">
              {name}
            </Typography>
            <Typography
              className={classes.address}
              variant="body2"
              component="p"
            >
              {address}
            </Typography>
          </Box>

          <Button
            type="button"
            sx={{ mt: 4 }}
            color="primary"
            variant="contained"
            onClick={() => {
              if (authContext.authState.userInfo.noBH === true)
                return history(`/boardinghouse/${id}`);
              if (authContext.authState.userInfo.noBH === false)
                return history(`/living/boardinghouse/${id}`);
            }}
          >
            View Boarding House
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default BHCards;
