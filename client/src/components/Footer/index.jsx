import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { makeStyles } from '@material-ui/core/styles';

import { Container, Grid, IconButton, Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(6, 0),
    marginTop: theme.spacing(8),
  },
  footerText: {
    color: theme.palette.grey[600],
  },
  link: {
    color: theme.palette.grey[600],
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  socialIcon: {
    color: theme.palette.grey[600],
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="stretch">
          <Grid item xs={12} md={3}>
            <Typography variant="h6" className={classes.footerText}>
              Connect With Us
            </Typography>
            <IconButton className={classes.socialIcon}>
              <FacebookIcon />
            </IconButton>
            <IconButton className={classes.socialIcon}>
              <TwitterIcon />
            </IconButton>
            <IconButton className={classes.socialIcon}>
              <InstagramIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="body2" className={classes.footerText}>
              © 2023 Welcome to Boarding House Information Reservation System.
              All rights reserved. This boardinghouse system and its content are
              protected by copyright law. Any unauthorized reproduction or
              distribution of this system, or any portion of it, may result in
              severe civil and criminal penalties, and will be prosecuted to the
              maximum extent possible under the law. This system may not be
              reproduced, duplicated, copied, sold, resold, or otherwise
              exploited for any commercial purpose without the express written
              consent of the owner. Unauthorized use of this system may also
              violate applicable intellectual property laws, including copyright
              and trademark laws. All trademarks, service marks, trade names,
              logos, and other identifying marks appearing in this system are
              the property of their respective owners. By using this system, you
              acknowledge and agree to abide by all copyright notices and other
              legal notices contained in this system. If you have any questions
              or concerns about the use of this system, please contact
              +6398766752131.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
