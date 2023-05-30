import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Link,
  Typography,
  Container,
  styled,
  Grid,
  Divider,
} from '@mui/material';
import Logo from '../../../components/Logo/Logo';
import LoginForm from '../../../components/AuthForm/Login/LoginForm';
import { useEffect, useState } from 'react';
import ForgotPassword from '../../../components/ForgotPassword';

const MainContent = styled(Box)(
  () => `
      height: 100vh;
      display: flex;
      flex: 1;
  `
);

const Login = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const handleModalClose = () => {
    setOpenPopup(false);
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1200);
    }

    window.addEventListener('resize', handleResize);

    // cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <MainContent>
        <Container
          maxWidth="xl"
          sx={{
            height: '100vh',
            margin: 'auto',
          }}
        >
          <Grid
            container
            gap={2}
            direction={!isMobile ? 'row' : 'column'}
            alignItems={'center'}
            justifyContent={!isMobile ? 'space-between' : 'center'}
            sx={{
              height: '100%',
            }}
          >
            <Grid item xs={!isMobile && 12} lg={4}>
              {isMobile ? <Logo wid={150} /> : <Logo wid={500} />}
            </Grid>
            <Grid item xs={!isMobile && 12} lg={4}>
              <Card
                sx={{
                  mt: 3,
                  px: 4,
                  pt: 5,
                  pb: 3,
                }}
                variant="outlined"
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 1,
                    }}
                    component="h2"
                  >
                    Sign In
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    fontWeight="normal"
                    sx={{
                      mb: 3,
                    }}
                  >
                    Fill in the fields below to sign into your account.
                  </Typography>
                </Box>
                <LoginForm />
                <Box>
                  <Box mb={2} mt={2}>
                    <Typography
                      onClick={() => {
                        setOpenPopup(true);
                      }}
                      align="center"
                      color="primary"
                      sx={{ cursor: 'pointer' }}
                    >
                      <b>Forget Password?</b>
                    </Typography>
                  </Box>
                  <Divider />
                  <Box mt={2}>
                    <Typography
                      component="span"
                      variant="subtitle2"
                      color="text.primary"
                      fontWeight="bold"
                    >
                      Don’t have an account, yet?
                    </Typography>{' '}
                    <Link component={RouterLink} to="/register">
                      <b>Sign up here</b>
                    </Link>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </MainContent>
      <ForgotPassword open={openPopup} closeModal={handleModalClose} />
    </>
  );
};

export default Login;
