import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import {
  dashboardBHLinks,
  dashboardTenantLinks,
  dashboardUserLinks,
  landlordLinks,
} from '../../../constants/menu-items-dashboard/dashboardLinks';
import routeConfig from '../../../config/routeConfig';
import { FetchContext } from '../../../context/FetchContext';
import { makeStyles } from '@material-ui/core';
import Logo from '../../../components/Logo/Logo.jsx';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const menu = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    url: '/dashboard',
    icon: <DashboardIcon />,
  },
];

const useStyles = makeStyles((theme) => ({
  list: {},
  listItem: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  notification: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
    minWidth: 24,
    minHeight: 24,
  },
}));

const Sidebar = ({ index }) => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElUNotif, setAnchorElNotif] = useState(null);
  const authContext = useContext(AuthContext);
  const fetchContext = useContext(FetchContext);
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

  useEffect(() => {
    const controller = new AbortController();
    const notifChannel = authContext.pusher.subscribe('notify');
    const reservationChannel = authContext.pusher.subscribe('reservation');
    getNotif();
    notifChannel.bind('notify-landlord', (res) => {
      getNotif();
      // setRecords(
      // 	records.map((request) =>
      // 		request._id === updateReq._id ? { ...records, updateReq } : request
      // 	)
      // );
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    notifChannel.bind('notify-delete', (res) => {
      getNotif();
      // setRecords(
      // 	records.map((request) =>
      // 		request._id === updateReq._id ? { ...records, updateReq } : request
      // 	)
      // );
      fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
    });

    reservationChannel.bind('canceled', (updateReq) => {
      getNotif();
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
    <Drawer variant="permanent" open={open} key={index}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          paddingY: 2,
        }}
      >
        <Link
          to={
            authContext.authState.userInfo.noBH === false
              ? '/home/living'
              : '/home'
          }
        >
          <Logo wid={open ? 150 : 40} />
        </Link>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          paddingY: 2,
          position: 'relative',
        }}
      >
        <Avatar
          alt={
            authContext.authState.userInfo
              ? `${authContext.authState.userInfo.firstName} ${authContext.authState.userInfo.lastName}`
              : ''
          }
          src={
            authContext.authState.userInfo
              ? `${authContext.authState.userInfo.image}`
              : ''
          }
          sx={{
            width: open ? 65 : 36,
            height: open ? 65 : 36,
          }}
        />
        <Box
          sx={{
            mt: open ? 0 : 1,
            position: open ? 'absolute' : 'static',
            right: 12,
            top: 10,
          }}
        >
          <Tooltip title="Open Settings">
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 0.5,
                pr: 0,
                cursor: 'pointer',
                mt: open ? 0 : 1,
              }}
              onClick={handleOpenUserMenu}
            >
              <MenuIcon fontSize="small" sx={{ p: 0 }} />
            </Paper>
          </Tooltip>
          <Tooltip title="Notification">
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 0.5,
                cursor: 'pointer',
                mt: 1,
              }}
              onClick={handleOpenNotifMenu}
            >
              <Badge badgeContent={notifs?.length} color="info">
                <NotificationsIcon color="action" />
              </Badge>
            </Paper>
          </Tooltip>
        </Box>

        <Menu
          // sx={{ mt: '55px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem
            onClick={() => {
              history(
                `/${authContext.authState.userInfo.role}/profile/${authContext.authState.userInfo._id}`
              );
            }}
          >
            <Typography textAlign="center">Profile Settings</Typography>
          </MenuItem>
          {Object.keys(authContext.authState.userInfo).length > 0 && (
            <Divider />
          )}
          {Object.keys(authContext.authState.userInfo).length > 0 && (
            <MenuItem onClick={handleLogOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Log out
            </MenuItem>
          )}
        </Menu>

        <Popover
          id="menu-appbar"
          anchorEl={anchorElUNotif}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElUNotif)}
          onClose={handleCloseUserMenu}
        >
          {notifs?.length > 0 ? (
            <List className={classes.list}>
              {notifs?.map((notif) => (
                <ListItem
                  className={classes.listItem}
                  key={notif?._id}
                  onClick={() => {
                    history(`/${notif?.urlLink}`);
                  }}
                >
                  <Alert severity="info" fullWidth>
                    <AlertTitle>
                      {notif?.made?.firstName} {notif?.made?.lastName}
                    </AlertTitle>
                    {notif?.description}
                  </Alert>
                </ListItem>
              ))}
            </List>
          ) : (
            <List className={classes.list}>
              <ListItem className={classes.listItem}>
                <ListItemText primary="No Notification" />
              </ListItem>
            </List>
          )}
        </Popover>

        {open && (
          <Box sx={{ mt: 1.5 }}>
            <Typography
              variant="h6"
              component="span"
              sx={{ textTransform: 'capitalize', textAlign: 'center' }}
            >
              {authContext.authState.userInfo
                ? `${authContext.authState.userInfo.firstName} ${authContext.authState.userInfo.lastName}`
                : ''}
            </Typography>
            <Typography
              variant="overline"
              component="span"
              sx={{ display: 'block', textAlign: 'center' }}
            >
              {authContext.authState.userInfo
                ? `${authContext.authState.userInfo.role}`
                : ''}
            </Typography>
          </Box>
        )}
      </Box>
      <Divider />

      <Box>
        <List>
          {menu.map((item, index) => {
            const isCurrentRoute = location.pathname === `${item.url}`;
            let listItemProps = {
              component: forwardRef((props, ref) => (
                <Link
                  ref={ref}
                  {...props}
                  to={`${routeConfig.basename}${item.url}`}
                />
              )),
            };
            return (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  display: 'block',
                  backgroundColor: isCurrentRoute
                    ? theme.palette.primary.main
                    : 'transparent',
                }}
              >
                <ListItemButton
                  {...listItemProps}
                  key={item.id}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    color: isCurrentRoute ? 'white' : 'inherit',
                    px: 'auto',
                  }}
                >
                  <ListItemIcon
                    key={item.url}
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isCurrentRoute ? 'white' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    key={item.title}
                    primary={item.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider />
        {authContext.isAdmin() && (
          <>
            <List
              subheader={
                open && (
                  <ListSubheader component="div">
                    {dashboardUserLinks?.title}
                  </ListSubheader>
                )
              }
            >
              {dashboardUserLinks?.children?.map((item, index) => {
                const isCurrentRoute = location.pathname === `${item.url}`;
                let listItemProps = {
                  component: forwardRef((props, ref) => (
                    <Link
                      ref={ref}
                      {...props}
                      to={`${routeConfig.basename}${item.url}`}
                    />
                  )),
                };
                return (
                  <div key={index}>
                    {item.allowedRoles.includes(
                      authContext.authState.userInfo.role
                    ) && (
                      <ListItem
                        disablePadding
                        sx={{
                          display: 'block',
                          backgroundColor: isCurrentRoute
                            ? theme.palette.primary.main
                            : 'transparent',
                        }}
                      >
                        <ListItemButton
                          {...listItemProps}
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 'auto',
                            color: isCurrentRoute ? 'white' : 'inherit',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                              color: isCurrentRoute ? 'white' : 'inherit',
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.title}
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )}
                  </div>
                );
              })}
            </List>
            <Divider />
            <List
              subheader={
                open && (
                  <ListSubheader component="div">
                    {dashboardBHLinks?.title}
                  </ListSubheader>
                )
              }
            >
              {dashboardBHLinks?.children?.map((item, index) => {
                const isCurrentRoute = location.pathname === `${item.url}`;
                let listItemProps = {
                  component: forwardRef((props, ref) => (
                    <Link
                      ref={ref}
                      {...props}
                      to={`${routeConfig.basename}${item.url}`}
                    />
                  )),
                };
                return (
                  <div key={index}>
                    {item.allowedRoles.includes(
                      authContext.authState.userInfo.role
                    ) && (
                      <ListItem
                        disablePadding
                        sx={{
                          display: 'block',
                          backgroundColor: isCurrentRoute
                            ? theme.palette.primary.main
                            : 'transparent',
                        }}
                      >
                        <ListItemButton
                          {...listItemProps}
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 'auto',
                            color: isCurrentRoute ? 'white' : 'inherit',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                              color: isCurrentRoute ? 'white' : 'inherit',
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.title}
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )}
                  </div>
                );
              })}
            </List>
          </>
        )}
        {authContext.isLandlord() && (
          <>
            <List
              subheader={
                open && (
                  <ListSubheader component="div">
                    {landlordLinks?.title}
                  </ListSubheader>
                )
              }
            >
              {landlordLinks?.children?.map((item, index) => {
                const isCurrentRoute = location.pathname === `${item.url}`;
                let listItemProps = {
                  component: forwardRef((props, ref) => (
                    <Link
                      ref={ref}
                      {...props}
                      to={`${routeConfig.basename}${item.url}`}
                    />
                  )),
                };
                return (
                  <div key={index}>
                    {item.allowedRoles.includes(
                      authContext.authState.userInfo.role
                    ) && (
                      <ListItem
                        disablePadding
                        sx={{
                          display: 'block',
                          backgroundColor: isCurrentRoute
                            ? theme.palette.primary.main
                            : 'transparent',
                        }}
                      >
                        <ListItemButton
                          {...listItemProps}
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 'auto',
                            color: isCurrentRoute ? 'white' : 'inherit',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                              color: isCurrentRoute ? 'white' : 'inherit',
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.title}
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )}
                  </div>
                );
              })}
            </List>
            <Divider />
            <List
              subheader={
                open && (
                  <ListSubheader component="div">
                    {dashboardTenantLinks?.title}
                  </ListSubheader>
                )
              }
            >
              {dashboardTenantLinks?.children?.map((item, index) => {
                const isCurrentRoute = location.pathname === `${item.url}`;
                let listItemProps = {
                  component: forwardRef((props, ref) => (
                    <Link
                      ref={ref}
                      {...props}
                      to={`${routeConfig.basename}${item.url}`}
                    />
                  )),
                };
                return (
                  <div key={index}>
                    {item.allowedRoles.includes(
                      authContext.authState.userInfo.role
                    ) && (
                      <ListItem
                        disablePadding
                        sx={{
                          display: 'block',
                          backgroundColor: isCurrentRoute
                            ? theme.palette.primary.main
                            : 'transparent',
                        }}
                      >
                        <ListItemButton
                          {...listItemProps}
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 'auto',
                            color: isCurrentRoute ? 'white' : 'inherit',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                              color: isCurrentRoute ? 'white' : 'inherit',
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.title}
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )}
                  </div>
                );
              })}
            </List>
            <Divider />
          </>
        )}
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <IconButton onClick={() => setOpen(!open)}>
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
