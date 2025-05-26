//@ts-nocheck
"use client";
//deploy
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { HTTPPostWithToken } from 'src/Services';
import { BASEURL } from 'src/Constant/Link';

const KYCVerification = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [bvn, setBvn] = useState("");
  const [image, setImage] = useState(null);
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBvnStep, setShowBvnStep] = useState(false);
  const fileInputRef = useRef(null);

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success', 'error', 'warning', 'info'
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.phone?.startsWith("+234")) {
      setShowBvnStep(true);
      setActiveStep(0); // Start with BVN verification for Nigerian users
    } else {
      setShowBvnStep(false);
      setActiveStep(1); // Skip to international verification for others
    }
  }, []);

  const steps = [
    { label: 'BVN Verification', optional: false },
    { label: 'ID Verification', optional: false },
  ];

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleBvnSubmit = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const response = await HTTPPostWithToken(
        `${BASEURL}/kyc/upgrade/${user.user_id}`,
        { bvn },
        user.token
      );

      if (response.code === 200) {
        showToast(response.message, 'success');
        setActiveStep(1); // Move to next step after successful BVN verification
      } else {
        showToast(response.errorMessage || response.Message, 'error');
      }
    } catch (error) {
      showToast(error.message || "Something went wrong", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdSubmit = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      if (!image) {
        showToast("Please upload your ID document", 'warning');
        setIsLoading(false);
        return;
      }

      // First upload the file
      const formData = new FormData();
      formData.append('file', image);

      const uploadResponse = await fetch('https://payload-x.com/server/cdn/file/upload.php', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      if (!uploadData.link) throw new Error('Upload failed');

      const payload = {
        means_of_id_link: uploadData.link,
        id_number: idNumber,
        dob,
        bvn,
        expiry: expiryDate,
        address
      };

      const endpoint = `${BASEURL}/kyc/upgrade/tier_three/${user.user.user_id}`;
      const response = await HTTPPostWithToken(endpoint, payload, user.user.token);

      if (response.code === 200) {
        showToast(response.message, 'success');
        setTimeout(() => {
          // router.push('/dashboard');
        }, 3000);
      } else {
        showToast(response.errorMessage || response.Message, 'error');
      }
    } catch (error) {
      showToast(error.message || "Something went wrong", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const renderBvnStep = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        BVN Verification
      </Typography>
      <br />
      <br />
      <TextField
        fullWidth
        label="BVN Number"
        variant="outlined"
        value={bvn}
        onChange={(e) => setBvn(e.target.value)}
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
        inputProps={{ maxLength: 11 }}
      />
      <Typography variant="body2" color="text.secondary">
        Adashe does not store your BVN. We only request it for compliance and account
        verification purposes, and it will not be stored or retained in our systems.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleBvnSubmit}
          disabled={isLoading || bvn.length !== 11}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Verify BVN'
          )}
        </Button>
      </Box>
    </Box>
  );

  const renderIdStep = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        ID Verification
      </Typography>
      <br />
      <br />
      <TextField
        fullWidth
        label="BVN Number"
        variant="outlined"
        value={bvn}
        onChange={(e) => setBvn(e.target.value)}
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
        inputProps={{ maxLength: 11 }}
      />
      <br />
      <br />
      <TextField
        fullWidth
        label="ID Number"
        variant="outlined"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}

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
      <br />
      <br />
      <TextField
        fullWidth
        label="Expiry Date"
        type="date"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}

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
      <br />
      <br />
      <TextField
        fullWidth
        label="Date of Birth"
        type="date"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        value={dob}
        onChange={(e) => setDob(e.target.value)}

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

      <br />
      <br />
      <TextField
        fullWidth
        label="Address"
        variant="outlined"
        multiline
        rows={3}
        value={address}
        onChange={(e) => setAddress(e.target.value)}

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
      <br />
      <br />
      <Typography variant="subtitle1" gutterBottom>
        Upload ID Document
      </Typography>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*,.pdf"
        style={{ display: 'none' }}
      />
      <br />
      <Button
        variant="outlined"
        component="span"
        startIcon={<CloudUploadIcon />}
        onClick={() => fileInputRef.current.click()}
        fullWidth
        sx={{ py: 2, mb: 2 }}
      >
        {image ? 'Document Selected' : 'Choose Document'}
      </Button>
      {image && (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', mb: 2 }}>
          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
          <Typography variant="body2">Document ready for upload</Typography>
        </Box>
      )}
      <Typography variant="caption" color="text.secondary">
        Supported formats: International Passport, Driver's License, National ID Card
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleIdSubmit}
          disabled={isLoading || !image}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Complete Verification'
          )}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <Card sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            KYC Verification
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Complete your Know Your Customer verification to access all features
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              (showBvnStep || index === 1) && (
                <Step key={step.label}>
                  <StepLabel optional={step.optional}>
                    {step.label}
                  </StepLabel>
                </Step>
              )
            ))}
          </Stepper>

          {activeStep === 0 && showBvnStep && renderBvnStep()}
          {activeStep === 1 && renderIdStep()}
        </CardContent>
      </Card>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default KYCVerification;