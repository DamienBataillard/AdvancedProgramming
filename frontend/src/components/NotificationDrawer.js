import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';


export default function AnchorTemporaryDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const [notifNumbers, setNotifNumbers] = React.useState(0);

  return (
    <div>
      <IconButton
              size="large"
              color="inherit"
              onClick={toggleDrawer(true)}
            >
              <Badge badgeContent={notifNumbers} color="error">
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
        />
      </Drawer>
    </div>
  );
}
