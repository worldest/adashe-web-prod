//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Modal, CircularProgress, IconButton, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import DateTimePicker from 'react-datepicker'; // Use a date picker library compatible with React
import { HTTPGetWithToken, HTTPPostWithToken } from 'src/Services';
import { BASEURL } from 'src/Constant/Link';

const CreateGroup: React.FC = () => {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [groupname, setGroupname] = useState('');
  const [des, setDes] = useState('');
  const [startingDate, setStartingDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentInterval, setPaymentInterval] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoadingKYC, setIsLoadingKyc] = useState(true)
  const [kyc, setKyc] = useState({
    "level": 0,
    "tier": "Newbie",
    "limit": "Restricted"
  })

  const createGroup = async () => {
    const user = localStorage.getItem("user");
    if (user === null) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user); // Now it's parsed properly
    console.log(parsedUser)
    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;

    console.log("User ID:", userId);
    console.log("Token:", token);
    if (!groupname || !des || !paymentInterval || !amount) {
      setModalVisible(true);
      setModalType('warning');
      setModalMessage('Please fill the required fields');
      return;
    }

    setIsLoading(true);

    const body = {
      userid: userId,
      group_name: groupname,
      group_description: des,
      payment_interval: paymentInterval,
      amount: amount,
    };

    try {
      const response = await HTTPPostWithToken(`${BASEURL}/group/create`, body, token);
      if (response.code === 200) {
        setModalType('success');
        setModalMessage(response.message);
        setTimeout(() => {
          setModalVisible(false);
          router.push('/'); // Redirect to dashboard
        }, 2000);
      } else {
        setModalType('warning');
        setModalMessage(response.errorMessage);
      }
    } catch (error) {
      setModalType('warning');
      setModalMessage('An error occurred, please try again.');
    } finally {
      setIsLoading(false);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user === null) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user); // Now it's parsed properly
    console.log(parsedUser)
    HTTPGetWithToken(`${BASEURL}/kyc/get/${parsedUser.user.user_id}`, parsedUser.user.token)
      .then(data => {
        console.log("KYC", data)
        setKyc(data.kyc)
      })
  }, [])

  return (
    <Box sx={{ padding: 5, minHeight: '100vh', backgroundColor: "#fff" }}>
      {
        kyc.level == 0 ?
          <center>
            <h2>Your account need verification</h2>
            <p></p>
            <Button variant='primary'>Verify Account</Button>
          </center>
          :
          <>
            <Grid item xs={12}>
              <Typography variant='h5' sx={{ color: "#000", fontWeight: "bold" }}>
                Create Group
              </Typography>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2, mt: 10 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Group Name"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setGroupname(e.target.value)}
                  sx={{
                    marginBottom: 4,
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
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Payment Interval"
                  variant="outlined"
                  fullWidth
                  select
                  value={paymentInterval}
                  onChange={(e) => setPaymentInterval(e.target.value)}
                  SelectProps={{ native: true }}
                  sx={{
                    marginBottom: 4,
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
                >
                  <option value=""></option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Amount"
                  variant="outlined"
                  fullWidth
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}
                  sx={{
                    marginBottom: 4,
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
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Group Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  onChange={(e) => setDes(e.target.value)}
                  sx={{
                    marginBottom: 4,
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
              </Grid>
              {/* <Grid item xs={12} md={6}>
          <DateTimePicker
            selected={startingDate}
            onChange={(date: Date) => setStartingDate(date)}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select starting date"
            className="form-control"
          />
        </Grid> */}
            </Grid>
            <Button
              variant="contained"
              onClick={createGroup}
              sx={{ mt: 2, width: '50%', mx: 'auto', display: 'block' }}
              style={{ backgroundColor: "#4fb26e" }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Group'}
            </Button>
            <Modal open={modalVisible} onClose={closeModal}>
              <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" color={modalType === 'success' ? 'green' : 'red'}>
                  {modalType === 'success' ? 'Success' : 'Warning'}
                </Typography>
                <Typography>{modalMessage}</Typography>
                <Button onClick={closeModal} variant="outlined" sx={{ mt: 2 }}>Close</Button>
              </Box>
            </Modal>
          </>
      }

    </Box>
  );
};

export default CreateGroup;
