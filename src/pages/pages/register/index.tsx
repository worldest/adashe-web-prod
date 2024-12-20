//@ts-nocheck
// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import toast, { Toaster } from 'react-hot-toast';
// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { useRouter } from 'next/router'


// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration' 
import Image from 'next/image';
import { HTTPPostNoToken } from 'src/Services'
import { BASEURL } from 'src/Constant/Link'
import { CircularProgress } from '@mui/material'

interface State {
  password: string
  showPassword: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = () => {
  // ** States
  const [values, setValues] = useState({
    firstname: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    showPassword: false
  });

  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  // ** Hook
  const theme = useTheme()
  const handleChange = (prop: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxChecked(event.target.checked);
  };

  const router = useRouter()
  const handleAcc = () => {
    const { email, password, firstname, lastName, phone } = values;
    if (!checkboxChecked) {
      toast("Please check the box to agree to privacy policy & terms.");
      return;
    }
    // Basic validation checks
    if (!email || !password || !firstname || !lastName || !phone) {
      toast('Please fill in all required fields.');
      return;
    }

    if (!validateEmail(email)) {
      toast('Please enter a valid email address.');
      return;
    }

    // Prepare the request body
    const body = {
      phone:phone,
      password:password,
      email:email,
      first_name:firstname,
      last_name:lastName
    };
    setLoading(true);
    // Perform the HTTP POST request
    HTTPPostNoToken(`${BASEURL}/auth/register`,body)
      .then(data => {
        setLoading(false);
        console.log(data)
        if (data.code === 200) {
          localStorage.setItem('user', JSON.stringify(data));
          router.push('/pages/login');
          toast(data.message);
        } else {
          toast(data.message);
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
        toast('An error occurred. Please try again.');
      });
  };

  // Helper function to validate email
  const validateEmail = (email: string) => {
    // Simple regex for email validation
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };


  return (
    <Box className='content-center' style={{backgroundColor:"eaf9ef"}}>
      <Toaster />
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Image
               src="/images/Logo2.jpg"  // Assuming your image is located at public/image/logo.png
              alt="Logo"
              width={120} 
              height={70} 
              style={{ objectFit: 'contain' }}
             />
              {/* <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              Adashe
            </Typography> */}
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Create Your Account
            </Typography>
            <Typography variant='body2'>
              Join us today and manage your tasks effortlessly!
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}> 
          <TextField
            autoFocus
            fullWidth
            id='firstname'
            label='Surname'
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
            value={values.firstname}
            onChange={handleChange('firstname')}
          />

            {/* Last Name Input */}
            <TextField
              fullWidth
              id='lastName'
              label='Last Name'
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
              value={values.lastName}
              onChange={handleChange('lastName')}
            />

            {/* Phone Number Input with +234 default */}
            <FormControl fullWidth  
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
              }}>
                <InputLabel htmlFor='phone-number'>Phone Number</InputLabel>
                <OutlinedInput
                  id='phone-number'
                  value={values.phone}
                  onChange={handleChange('phone')}
                  startAdornment={<InputAdornment position='start'>+234</InputAdornment>}
                  label='Phone Number'
                  type='tel' 
                />
              </FormControl>


            {/* Email Input */}
            <TextField
              fullWidth
              type='email'
              label='Email'
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
              value={values.email}
              onChange={handleChange('email')}
            />

            <FormControl fullWidth   
            sx={{ 
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
              }}>
              <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-register-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                    </IconButton>
                  </InputAdornment>
                } 
              />
               {/* <Typography variant='body2' color='error'>
                Password must be strong and more than 6 characters.
              </Typography> */}
            </FormControl>
            <FormControlLabel
              control={<Checkbox checked={checkboxChecked} onChange={handleCheckboxChange}  sx={{ 
                '&.Mui-checked': {
                color: "#4fb26e",
                 },
               }}/>}
              label={
                <Fragment>
                  <span>I agree to </span>
                  <Link href='/' passHref>
                    <LinkStyled style={{color:'#d96b60'}} onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                      privacy policy & terms
                    </LinkStyled>
                  </Link>
                </Fragment>
              }
            />
            <Button  onClick={handleAcc} fullWidth size='large' type='submit' variant='contained' sx={{ marginBottom: 7 }} style={{backgroundColor:"#4fb26e"}}>
            {loading ? <CircularProgress size={24} color='inherit' /> : 'Sign up'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Already have an account?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/login'>
                  <LinkStyled style={{color:'#d96b60'}} >Sign in instead</LinkStyled>
                </Link>
              </Typography>
            </Box> 
          </form>
        </CardContent>
      </Card>
      {/* <FooterIllustrationsV1 /> */}
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
