import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, Link, Typography, Container, styled } from '@mui/material';
import Logo from '../../../components/Logo/Logo';
import RegisterForm from '../../../components/AuthForm/Register/RegisterForm';

const MainContent = styled(Box)(
  () => `
      height: 100%;
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
  `
);

const TopWrapper = styled(Box)(
  () => `
    display: flex;
    width: 100%;
    flex: 1;
    padding: 20px;
    justify-content: center;
  `
);

const Register = () => {
  return (
    <>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="xl">
            <Logo wid={150} />
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
                  Register
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3,
                  }}
                >
                  Fill in the fields below to register.
                </Typography>
              </Box>
              <RegisterForm />
              <Box mt={4}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  Already have an account?
                </Typography>{' '}
                <Link component={RouterLink} to="/">
                  <b>Sign in here</b>
                </Link>
              </Box>
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
};

export default Register;
