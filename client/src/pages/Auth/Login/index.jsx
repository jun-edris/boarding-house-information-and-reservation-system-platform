import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, Link, Typography, Container, styled } from '@mui/material';
import Logo from '../../../components/Logo/Logo';
import LoginForm from '../../../components/AuthForm/Login/LoginForm';

const MainContent = styled(Box)(
	() => `
      height: 100%;
      display: flex;
      flex: 1;
      flex-direction: column;
  `
);

const TopWrapper = styled(Box)(
	() => `
    display: flex;
    width: 100%;
    flex: 1;
    padding: 20px;
    height: calc(100vh - 70px);
  `
);

const Login = () => {
    
	return (
		<>
			<MainContent>
				<TopWrapper>
					<Container maxWidth='sm'>
						<Logo />
						<Card
							sx={{
								mt: 3,
								px: 4,
								pt: 5,
								pb: 3,
							}}
							variant='outlined'
						>
							<Box>
								<Typography
									variant='h4'
									sx={{
										mb: 1,
									}}
									component='h2'
								>
									Sign In
								</Typography>
								<Typography
									variant='subtitle1'
									color='text.secondary'
									fontWeight='normal'
									sx={{
										mb: 3,
									}}
								>
									Fill in the fields below to sign into your account.
								</Typography>
							</Box>
							<LoginForm />
							<Box my={4}>
								<Typography
									component='span'
									variant='subtitle2'
									color='text.primary'
									fontWeight='bold'
								>
									Don’t have an account, yet?
								</Typography>{' '}
								<Link component={RouterLink} to='/register'>
									<b>Sign up here</b>
								</Link>
							</Box>
						</Card>
					</Container>
				</TopWrapper>
			</MainContent>
		</>
	);
};

export default Login;
