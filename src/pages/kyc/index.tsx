//@ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  Grid,
  Modal,
  Drawer,
  Tabs, Tab, TextField, Button, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material'; 
import { HTTPGetWithToken, HTTPPatchWithToken } from 'src/Services';
import { BASEURL } from 'src/Constant/Link';
import GroupDetailsModal from 'src/@core/components/Modal';
import toast, { Toaster } from 'react-hot-toast';

const PaymentRequest: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [data, setData] = useState([]); 
  const [group, setGroup] = useState([]); 
  const [Country, setCountry] = useState("+234");
  const [date, setDate] = useState("");
  const [profileImg, setProfileImg] = useState<string | null>(null);  
  const [groups, setGroups] = useState([]); 
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleGroupPress = (groupId: number) => {
    setSelectedGroupId(groupId);
    setModalVisible(true);
  };

  const handlePaymentRequest = () => {
    console.log('Payment requested for amount:', amount);
    setAmount('');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getGroup = async () => { 
    const user = await localStorage.getItem("user");

    if (user === null) {
      // Handle navigation if user is null
      return;  
    }
    
    const parsedUser = JSON.parse(user); 
    const userId = parsedUser.user.user_id; 
    const token = parsedUser.user.token;
    HTTPGetWithToken(`${BASEURL}/group/member/${userId}}`, token)
      .then(data => { 
        console.log(data)
        if (data.code === 200) { 
          const payload = data.payload.map((item: any) => {
            if (item.start_date) { 
              item.start_date = formatDate(item.start_date);
              setDate(item.start_date);
            }
            return item;
          });
          setGroup(payload); 
        } else {
          console.error('Error fetching data:', data.message);
        }
      })
      .catch(error => {
        console.error('Error making HTTP request:', error);
      });
  };

  useEffect(() => {  
    getGroup();
  }, []);
  
 
  useEffect(() => {
    const fetchUserData = async () => { 
        const user = localStorage.getItem("user");
        if (user === null) {
          router.push('/pages/login');
          return;
        }

        const parsedUser = JSON.parse(user); // Now it's parsed properly

        const userId = parsedUser.user.user_id;
        const token = parsedUser.user.token;
    
      try {
        const data = await HTTPGetWithToken(`${BASEURL}/user/${userId}`,token);
        console.log("TXN", data)
        if (data.code === 200) {
          const userData = data.payload;
            setEmail(userData.email);
            setPhone(userData.phone);
            setFirstName(userData.first_name);
            setLastName(userData.last_name); 
        } else {
          console.error('Error fetching account data:', data.message);
        }
      } catch (error) {
        console.error('Error making HTTP request:', error);
      } 
      }


    fetchUserData();
  }, []);

  return (   
    <Box sx={{ padding: 5, minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Profile Header */}
      <Grid container spacing={2} sx={{ paddingX: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#000', fontWeight: 'bold' }}
        >
          Profile
        </Typography>
      </Grid>

      {/* User Info and Tabs Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          py: 4,
          borderRadius: 2,
          mt: 4,
        }}
      >
        {/* User Info */}
        <Avatar
          sx={{ width: 96, height: 96, bgcolor: 'grey.400', mb: 2 }}
          alt="User Avatar"
        />
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          {firstName + " " + lastName}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {email}
        </Typography>

        {/* Tabs Section */}
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            width: '100%',
            maxWidth: 800,
            borderRadius: 2,
          }}
        >
          {/* Tabs Menu */}
          <Box
            sx={{
            }}
          >
            <Tabs
              orientation="horizontal"
              value={selectedTab}
              onChange={handleTabChange}
              style={{overFlowX: "auto"}}
              sx={{
                '& .MuiTab-root': {
                  alignItems: 'flex-start',
                  textTransform: 'none',
                  padding: 2,
                },
                '& .Mui-selected': {
                  color: '#4fb26e', // Active tab text color
                  fontWeight: 'bold', // Optional: Make it bold for better visibility
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#4fb26e', // Indicator line color
                },
              }}
            >
              <Tab label="Edit Profile" />
              <Tab label="Change Password" />
              <Tab label="Help" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            sx={{
              flex: 1,
              p: 3,
            }}
          >
            {selectedTab === 0 && <EditProfile />}
            {selectedTab === 1 && <ChangePassword email={email} />}
            {selectedTab === 2 && <HelpSupport />}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
const EditProfile = () => {
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [selectedTab, setSelectedTab] = useState(0);
  const handleContinue = async () => { 
    if (!firstName || !lastName) {
      setSnackbar({
        open: true,
        message: 'Please fill in the required fields.',
        severity: 'warning',
      });
      return;
    }

    try {
      setIsLoading(true); 
      const user = localStorage.getItem("user");
      const parsedUser = JSON.parse(user); // Now it's parsed properly

        const userId = parsedUser.user.user_id;
        const token = parsedUser.user.token;
      const body = { first_name: firstName, last_name: lastName };

      const response = await HTTPPatchWithToken(`${BASEURL}/user/update/${userId}`, body, token)
      console.log(response)
      if (response.code === 200) {
        toast(response.message,)
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'success',
        }); 
      } else {
        setSnackbar({
          open: true,
          message: response.errorMessage,
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating your profile.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => { 
        const user = localStorage.getItem("user");
        if (user === null) {
          router.push('/pages/login');
          return;
        }

        const parsedUser = JSON.parse(user); // Now it's parsed properly

        const userId = parsedUser.user.user_id;
        const token = parsedUser.user.token;
    
      try {
        const data = await HTTPGetWithToken(`${BASEURL}/user/${userId}`,token);
        console.log("TXN", data)
        if (data.code === 200) {
          const userData = data.payload;
            setEmail(userData.email);
            setPhone(userData.phone);
            setFirstName(userData.first_name);
            setLastName(userData.last_name); 
        } else {
          console.error('Error fetching account data:', data.message);
        }
      } catch (error) {
        console.error('Error making HTTP request:', error);
      } 
      }


    fetchUserData();
  }, []);
  return(
      <Box sx={{ p: 4, backgroundColor: '#f9f9f9', borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
        <Toaster />
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Edit Profile
      </Typography>

      {/* First Name */}
      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        fullWidth
        sx={{ 
          mb: 3 ,
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#d96b60', // Border color on focus
            },
            '& input::placeholder': {
              color: 'rgba(0, 0, 0, 0.54)', // Default placeholder color
            },
            '&.Mui-focused input::placeholder': {
              color: '#4fb26e', // Placeholder color on focus
            }
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.54)', // Default label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#4fb26e', // Label color when focused
          }
        }}
      />

      {/* Last Name */}
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        fullWidth
        sx={{ 
          mb: 3 ,
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#d96b60', // Border color on focus
            },
            '& input::placeholder': {
              color: 'rgba(0, 0, 0, 0.54)', // Default placeholder color
            },
            '&.Mui-focused input::placeholder': {
              color: '#4fb26e', // Placeholder color on focus
            }
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.54)', // Default label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#4fb26e', // Label color when focused
          }
        }}
      />

      {/* Email (non-editable) */}
      <TextField
        label="Email"
        value={email}
        fullWidth
        InputProps={{ readOnly: true }}
        sx={{ 
          mb: 3 ,
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#d96b60', // Border color on focus
            },
            '& input::placeholder': {
              color: 'rgba(0, 0, 0, 0.54)', // Default placeholder color
            },
            '&.Mui-focused input::placeholder': {
              color: '#4fb26e', // Placeholder color on focus
            }
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.54)', // Default label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#4fb26e', // Label color when focused
          }
        }}
      />

      {/* Phone (non-editable) */}
      <TextField
        label="Phone"
        value={phone}
        fullWidth
        InputProps={{ readOnly: true }}
        sx={{ 
          mb: 3 ,
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#d96b60', // Border color on focus
            },
            '& input::placeholder': {
              color: 'rgba(0, 0, 0, 0.54)', // Default placeholder color
            },
            '&.Mui-focused input::placeholder': {
              color: '#4fb26e', // Placeholder color on focus
            }
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.54)', // Default label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#4fb26e', // Label color when focused
          }
        }}
      />

      {/* Submit Button */}
      <Button
        onClick={handleContinue}
        variant="contained"
        fullWidth
        sx={{ mt: 2, }}
        style={{backgroundColor:"#4fb26e"}}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save Changes'}
      </Button>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const ChangePassword = ({email}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const handleContinue = async () => {
    if (email.trim() === '') {
      setSnackbar({
        open: true,
        message: 'Please fill the required fields.',
        severity: 'warning',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Simulate a delay to mimic real-world API calls
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Display warning (placeholder for unconfigured email service)
      setSnackbar({
        open: true,
        message: 'Email service not configured.',
        severity: 'warning',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

   return(
<Box sx={{ p: 4, backgroundColor: '#f9f9f9', borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
        Change Password
      </Typography>

      {/* Email Field */}
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        fullWidth
        disabled
        sx={{ 
          mb: 3 ,
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#d96b60', // Border color on focus
            },
            '& input::placeholder': {
              color: 'rgba(0, 0, 0, 0.54)', // Default placeholder color
            },
            '&.Mui-focused input::placeholder': {
              color: '#4fb26e', // Placeholder color on focus
            }
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(0, 0, 0, 0.54)', // Default label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#4fb26e', // Label color when focused
          }
        }}
      />

      {/* Submit Button */}
      <Button
        onClick={handleContinue}
        variant="contained"
        fullWidth 
        sx={{ mt: 2, }}
        style={{backgroundColor:"#4fb26e"}}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Proceed'}
      </Button>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
   )
};

const HelpSupport = () => (
  <Typography variant="body1">Help & Support Content</Typography>
);
export default PaymentRequest;
