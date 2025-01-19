import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { fetchNotifications, updateNotificationStatus } from '../services/apiService';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTranslation } from 'react-i18next';
import DoneIcon from '@mui/icons-material/Done';

export default function AnchorTemporaryDrawer({ unreadNotifications }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifNumbers, setNotifNumbers] = React.useState(0);
  const [notifications, setNotifications] = React.useState([]);
  const [showRead, setShowRead] = React.useState(false); // Toggles between read and unread notifications
  const { t } = useTranslation();

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

  const handleToggle = () => {
    setShowRead((prev) => !prev); // Toggle between read and unread notifications
  };

  // Filter notifications based on `showRead`
  const filteredNotifications = notifications.filter((notif) => notif.is_read === (showRead ? 1 : 0));

  return (
<div>
  <IconButton size="large" color="inherit" onClick={toggleDrawer(true)}>
    <Badge badgeContent={unreadNotifications} color="error">
      <NotificationsIcon />
    </Badge>
  </IconButton>
  <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
    <Box
      sx={{ width: 500 }}
      role="presentation"
    >
      <div className="Notification_title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
        <span>Notifications</span>
        <FormControlLabel
          control={<Switch checked={showRead} onChange={handleToggle} />}
          label={showRead ? t("readNotifications") : t("unreadNotifications")}
        />
      </div>
      <div>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id_notification}
              className="card"
              style={{
                margin: '8px',
                padding: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                display: 'flex', // Flexbox layout
                justifyContent: 'space-between', // Space between message and button
                alignItems: 'center', // Center items vertically
              }}
            >
              {/* Message container */}
              <div style={{ flexGrow: 1, marginRight: '16px', whiteSpace: 'pre-wrap' }}>
                {notif.message}
              </div>

              {/* Button */}
              {notif.is_read === 0 && (
                <IconButton
                onClick={async () => {
                  try {
                      // Call the API to update the notification status
                      await updateNotificationStatus(notif.id_notification, true);
          
                      // Update the local state after successful API call
                      const updatedNotifications = notifications.map((n) => {
                          if (n.id_notification === notif.id_notification) {
                              return { ...n, is_read: 1 }; // Mark as read
                          }
                          return n;
                      });
                      setNotifications(updatedNotifications); // Update the state
                  } catch (error) {
                      console.error('Erreur lors de la mise à jour de la notification:', error);
                  }
              }}
                >
                  <DoneIcon /> {/* Icon displayed inside the button */}
                </IconButton>
              )}
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