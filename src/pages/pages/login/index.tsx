//@ts-nocheck
// ** React Imports
import { ChangeEvent, MouseEvent, ReactNode, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
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

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { HTTPPostNoToken } from 'src/Services'
import { BASEURL } from 'src/Constant/Link' 
import Image from 'next/image';
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
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => { 
  const [values, setValues] =  useState({ 
    phone: '', 
    password: '',
    showPassword: false
  }); 
  const [loading, setLoading] = useState(false);
  const Login = async () => {
    setLoading(true);
    const { password, phone } = values;
 
    if (!phone || !password) {
        setLoading(false);
        toast("Please fill in all the required fields.");
        return;
    }

    const body = {
      "userid": phone,
       "password": password,
    };

    console.log("Request body:", body);

    const data = await HTTPPostNoToken(`${BASEURL}/auth/login`, body);

    setLoading(false);
     
    if (data) {
        console.log("Response data:", data);

        if (data.code === 200) {
          toast("Successfully logged in. Redirecting to dashboard.")
            localStorage.setItem("user", JSON.stringify(data));
            router.push('/');
        } else {
            toast(data.message || "Incorrect password. Please check your phone number.");
        }
    } else {
        toast("Failed to receive a response from the server.");
    }
};

  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Box className='content-center'>
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
            Welcome to Adashe! 👋🏻
            </Typography>
            <Typography variant='body2'>
            Please sign-in to your account
            </Typography>
          </Box> 
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}> 
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
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                    </IconButton>
                  </InputAdornment>
                } 
              /> 
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            > 
              {/* <Link passHref href='/'>
                <LinkStyled onClick={e => e.preventDefault()}>Forgot Password?</LinkStyled>
              </Link> */}
            </Box>
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={Login}
              style={{backgroundColor:"#4fb26e"}}
            >
               {loading ? <CircularProgress size={24} color='inherit' /> : 'Login'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/register'>
                  <LinkStyled style={{color:'#d96b60'}}>Create an account</LinkStyled>
                </Link>
              </Typography>
            </Box> 
          </form>
        </CardContent>
      </Card> 
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
