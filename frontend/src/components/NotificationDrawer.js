import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { fetchNotifications } from '../services/apiService';


export default function AnchorTemporaryDrawer({unreadNotifications}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifNumbers, setNotifNumbers] = React.useState(0);
  const [notifications, setNotifications] = React.useState([]);

  const toggleDrawer = (open) => async (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);

    if (open) {
      try {
        const data = await fetchNotifications(); // Fetch notifications from API
        setNotifications(data.notifications || []); // Update notifications state
        setNotifNumbers(data.notifications.filter((notif) => notif.is_read === 0).length); // Update unread notifications count
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    }

  };
  console.log(notifications.length)
  console.log(notifications.length)
  return (
    <div>
      <IconButton
              size="large"
              color="inherit"
              onClick={toggleDrawer(true)}
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 500 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <div className='Notification_title'>Notifications</div>
          <div>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id_notification} className="card" style={{
                  margin: '8px',
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                }}>
                  {notif.message}
                </div>
              ))
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', color: '#aaa' }}>
                No notifications available.
              </div>
            )}
          </div>
        </Box>
      </Drawer>
    </div>
  );
}
