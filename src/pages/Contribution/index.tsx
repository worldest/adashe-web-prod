import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Avatar,
  Paper,
  IconButton,
  CircularProgress,
  Snackbar,
  Grid,
} from '@mui/material';  
import { HTTPGetWithToken } from 'src/Services';
import { BASEURL } from 'src/Constant/Link';
import { useRouter } from 'next/router';

const PaymentHistoryPage: React.FC = () => { 
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  const router = useRouter()
  const getTrans = async () => {
    const user = localStorage.getItem("user");

    if (user === null) {
      router("/login");
      return;
    }

    const parsedUser = JSON.parse(user);
    const userId = parsedUser.user.user_id; 
    const token = parsedUser.user.token;
    HTTPGetWithToken(`${BASEURL}/user/transactions/${userId}`,token)
      .then(data => {
        if (data.code === 200) {
          setPayments(data.payload);
        } else {
          // Handle error cases
          console.error('Error fetching transaction data:', data.message);
          setSnackbarMessage(data.message);
          setSnackbarOpen(true);
        }
      })
      .catch(error => {
        // Handle request errors
        console.error('Error making HTTP request:', error);
        setSnackbarMessage("An error occurred while fetching transactions.");
        setSnackbarOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTrans();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: 5, backgroundColor:"#fff" }}>
     <Grid item xs={12}>
    <Typography variant='h5'sx={{color:"#000",fontWeight:"bold"}}>
    Contribution History
    </Typography>
    </Grid>
      <Box sx={{
        padding: 2,
        backgroundColor: '#fff', 
        boxShadow: 0,
        marginTop: 2,
      }}>
        {/* <Typography variant="h4" sx={{ marginBottom: 2 }}>Payment History</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <img src="../../assets/logo.png" alt="Logo" style={{ width: 100, height: 100, borderRadius: 20 }} />
        </Box> */}
        {loading ? (
          <CircularProgress sx={{color:'#4fb26e'}} />
        ) : (
          payments.map(payment => (
            <Paper key={payment.id} sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              border:"2px solid",
              borderColor:"#4fb26e",
              marginBottom: 2,
              backgroundColor: '#e8f9ed',
              borderRadius: 2,
              boxShadow: 0,
            }}>
              <Box sx={{ marginRight: 2 }}> 
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{color:"#000"}}>{payment.group_name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {payment.created_at.substring(0, 19)}
                </Typography>
                <Typography variant="body2" sx={{ color: payment.status === 0 ? 'orange' : payment.status === 1 ? 'green' : 'red' }}>
                  {payment.status === 0 ? "Pending" : payment.status === 1 ? "Completed" : "Queried"}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{color:"#000", fontWeight:"bold"}}>₦{payment.amount}</Typography>
            </Paper>
          ))
        )}
        <Box sx={{ height: 200 }}></Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default PaymentHistoryPage;
