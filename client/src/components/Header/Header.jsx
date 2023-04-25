import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import Logo from '../Logo/Logo';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FetchContext } from '../../context/FetchContext';

const Header = () => {
  const authContext = useContext(AuthContext);
  const fetchContext = useContext(FetchContext);
  const location = useLocation();
  const [notifs, setNotifs] = useState([]);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElUNotif, setAnchorElNotif] = useState(null);
  const history = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setAnchorElNotif(null);
  };

  const handleOpenNotifMenu = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleLogOut = async () => {
    try {
      await fetchContext.authAxios.get('/auth/logout');
      authContext.logout();
      history('/');
    } catch (error) {
      console.log(error?.response?.message);
    }
  };

  const getNotif = async () => {
    fetchContext.authAxios
      .get(`/notify`)
      .then(({ data }) => {
        setNotifs(data.notif);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatedToLiving = async () => {
    fetchContext.authAxios
      .get(`/user/living`)
      .then(({ data }) => {
        if (!data) {
          return false;
        }
        if (data) {
          localStorage.setItem('userInfo', data.user);
          authContext.setAuthState({
            ...authContext.authState,
            userInfo: data.user,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatedToNew = async () => {
    fetchContext.authAxios
      .get(`/user/new`)
      .then(({ data }) => {
        if (data) {
          localStorage.setItem('userInfo', data.user);
          authContext.setAuthState({
            ...authContext.authState,
            userInfo: data.user,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const notifChannel = authContext.pusher.subscribe('notify');
    const reserveChannel = authContext.pusher.subscribe('reserve');

    notifChannel.bind('notify-tenant', (res) => {
      getNotif();
      updatedToLiving();
      updatedToNew();

      // setRecords(
      // 	records.map((request) =>
      // 		request._id === updateReq._id ? { ...records, updateReq } : request
      // 	)
      // );
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    reserveChannel.bind('expired', (res) => {
      getNotif();
      updatedToLiving();
      updatedToNew();

      // setRecords(
      // 	records.map((request) =>
      // 		request._id === updateReq._id ? { ...records, updateReq } : request
      // 	)
      // );
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    return () => controller.abort();
  }, [fetchContext.refreshKey]);

  return (
    <>
      <AppBar position="sticky" color="" sx={{ py: 1 }}>
        <Container maxWidth={false}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Link
                to={
                  authContext.authState.userInfo.noBH === false
                    ? '/home/living'
                    : '/home'
                }
              >
                <Logo />
              </Link>
            </Box>

            <Box
              sx={{
                flexGrow: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {location.pathname !== '/living' &&
                authContext.authState.userInfo.noBH === false && (
                  <Box>
                    <Button
                      variant="contained"
                      onClick={() => history('/living')}
                    >
                      Go to My Room
                    </Button>
                  </Box>
                )}
              <Tooltip title="Notification">
                <Paper
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 0.5,
                    cursor: 'pointer',
                  }}
                  onClick={handleOpenNotifMenu}
                >
                  <Badge badgeContent={notifs?.length} color="info">
                    <NotificationsIcon color="action" />
                  </Badge>
                </Paper>
              </Tooltip>
              {Object.keys(authContext.authState.userInfo).length > 0 && (
                <Box
                  sx={{
                    flexGrow: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="h6"
                    sx={{ textTransform: 'capitalize' }}
                  >{`${authContext.authState.userInfo.firstName} ${authContext.authState.userInfo.lastName}`}</Typography>
                  <Typography
                    variant="body2"
                    component="span"
                  >{`${authContext.authState.userInfo.role}`}</Typography>
                </Box>
              )}

              <Tooltip title="Open settings">
                <Paper
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 1,
                    px: 1,
                    gap: 1.5,
                    borderRadius: 28,
                    cursor: 'pointer',
                  }}
                  onClick={handleOpenUserMenu}
                >
                  <MenuIcon fontSize="small" />
                  {Object.keys(authContext.authState.userInfo).length > 0 ? (
                    <Avatar
                      alt={
                        authContext.authState.userInfo
                          ? `${authContext.authState.userInfo.firstName} ${authContext.authState.userInfo.lastName}`
                          : ''
                      }
                      sx={{ width: 28, height: 28 }}
                      src={
                        authContext.authState.userInfo
                          ? `${authContext.authState.userInfo.image}`
                          : ''
                      }
                    />
                  ) : (
                    <Avatar>
                      <AccountCircleIcon />
                    </Avatar>
                  )}
                </Paper>
              </Tooltip>
              <Menu
                sx={{ mt: '55px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* {settings.map((setting) => (
									<MenuItem key={setting} onClick={handleCloseUserMenu}>
										<Typography textAlign='center'>{setting}</Typography>
									</MenuItem>
								))} */}

                <MenuItem
                  sx={{ width: 190 }}
                  onClick={() => {
                    if (authContext.authState.userInfo.noBH === true) {
                      history(`/profile/${authContext.authState.userInfo._id}`);
                    }
                    if (authContext.authState.userInfo.noBH === false) {
                      history(
                        `/profile/living/${authContext.authState.userInfo._id}`
                      );
                    }
                  }}
                >
                  <Typography textAlign="center">Profile Settings</Typography>
                </MenuItem>
                {Object.keys(authContext.authState.userInfo).length > 0 && (
                  <Divider />
                )}

                {Object.keys(authContext.authState.userInfo).length > 0 && (
                  <MenuItem onClick={handleLogOut}>Log out</MenuItem>
                )}
              </Menu>
              <Menu
                // sx={{ mt: '55px' }}
                id="menu-appbar"
                anchorEl={anchorElUNotif}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUNotif)}
                onClose={handleCloseUserMenu}
              >
                {notifs?.length > 0 ? (
                  notifs?.map((notif, index) => (
                    <MenuItem
                      key={notif?._id}
                      onClick={() => {
                        history(`/${notif?.urlLink}`);
                      }}
                    >
                      <Typography textAlign="center">
                        {notif?.description}
                      </Typography>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>
                    <Typography textAlign="center">
                      No Notification to display!
                    </Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
