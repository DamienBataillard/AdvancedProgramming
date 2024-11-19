import { Box, Typography } from '@mui/material';
import PrimarySearchAppBar from '../components/AppBar'
import logo from '../assets/images/logo.png';
import '../index.css';


function StudentDashboard() {
  return (
    <div className="App">
      <PrimarySearchAppBar />
      <div className='dashboard-container'>
      <img src={logo} alt="Site Logo" className="site-logo"/>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '10px',
            width: '50%',
            height: '400px',
            margin: 'auto',
            mt: '5%',
            display: 'flex',
            boxShadow: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              borderRight: '1px solid black',
            }}
          >
            <Typography variant="h6">Available Surveys</Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6">Open Feedbacks</Typography>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default StudentDashboard;