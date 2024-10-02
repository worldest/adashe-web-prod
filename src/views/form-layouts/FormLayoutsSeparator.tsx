 // ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { HTTPPostNoToken } from 'src/Services'
import { BASEURL } from 'src/Constant/Link'
import { useRouter } from 'next/router'

interface State {
  password: string
  password2: string
  showPassword: boolean
  showPassword2: boolean
}

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Match date' autoComplete='off' />
})

const FormLayoutsSeparator = () => {

  // ** States

  const router = useRouter()
  const [league, setLeague] = useState("")
  const [sport, setSport] = useState("")
  // const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [awayTeam, setAwayTeam] = useState("")
  const [prediction, setPrediction] = useState("")
  const [category, setCategory] = useState("")
  const [homeTeam, setHomeTeam] = useState("")
  const [language, setLanguage] = useState<string[]>([]) 
  const [startDate, setStartDate] = useState(new Date());
  const [values, setValues] = useState<State>({
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false
  })
 const postPrediction = () => {
  if(prediction === "" || sport === "" || awayTeam === "" || category === "" || homeTeam === "" || startDate  === null|| time === "" || league == ""){
    alert("Fill the requirements")
  }else{
    
  var body ={
    ref: "PremiumMatches",
    data: {
      Prediction: prediction,
      away: awayTeam,
      category: category,
      home: homeTeam,
      match_date: startDate,
      match_time: time,
      sport: sport,
      league: league
    }
  } 
  console.log(body)
  HTTPPostNoToken(`${BASEURL}/set/pushToNode`,body)
  .then(data => {
    console.log(data)
    if(data.code === 200){
      alert("Prediction uploaded sucessfully")   
      router.push('/')
    }else{
      alert("Try again")
    }
  })
}
 }
  // Handle Password
  const handlePasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Confirm Password
  const handleConfirmChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 })
  }
  const handleMouseDownConfirmPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Select
  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    setLanguage(event.target.value as string[])
  }

  return (
    <Card>
      <CardHeader title='Add Prediction' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            {/* <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Account Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Username' placeholder='carterLeonard' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='email' label='Email' placeholder='carterleonard@gmail.com' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-separator-password'>Password</InputLabel>
                <OutlinedInput
                  label='Password'
                  value={values.password}
                  id='form-layouts-separator-password'
                  onChange={handlePasswordChange('password')}
                  type={values.showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid> */}
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-separator-password-2'>Confirm Password</InputLabel>
                <OutlinedInput
                  value={values.password2}
                  label='Confirm Password'
                  id='form-layouts-separator-password-2'
                  onChange={handleConfirmChange('password2')}
                  type={values.showPassword2 ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        aria-label='toggle password visibility'
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                      >
                        {values.showPassword2 ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid> */}
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Add Prediction
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='League' placeholder='Premier League' onChange={(e) => {setLeague(e.target.value)}}/>
            </Grid> 
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Sport</InputLabel>
                <Select
                  label='Sport'
                  // defaultValue={setSport}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  onChange={(e)=>{setSport(e.target.value)}}
                >
                  <MenuItem value="Football">Football</MenuItem>
                  <MenuItem value="Basketball">Basketball</MenuItem>
                  <MenuItem value="Tennis">Tennis</MenuItem>  
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Home team' placeholder='Futnance FC' onChange={(e) => {setHomeTeam(e.target.value)}} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Away team' placeholder='Futnance Fc' onChange={(e) => {setAwayTeam(e.target.value)}}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Prediction' placeholder='1 or GG' onChange={(e) => {setPrediction(e.target.value)}}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Category</InputLabel>
                <Select
                  label='Category'
                  // defaultValue={setCategory}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  onChange={(e)=>{setCategory(e.target.value)}}
                >
                  <MenuItem value="Free">Free  tips</MenuItem>
                  <MenuItem value="Combo, 2 and 5 odds and 20 weekend odds">Combo, 2 and 5 odds and 20 weekend odds</MenuItem>
                  <MenuItem value="Big odds">Big odds</MenuItem>  
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-multiple-select-label'>Language</InputLabel>
                <Select
                  multiple
                  value={language}
                  onChange={handleSelectChange}
                  id='form-layouts-separator-multiple-select'
                  labelId='form-layouts-separator-multiple-select-label'
                  input={<OutlinedInput label='Language' id='select-multiple-language' />}
                >
                  <MenuItem value='English'>English</MenuItem>
                  <MenuItem value='French'>French</MenuItem>
                  <MenuItem value='Spanish'>Spanish</MenuItem>
                  <MenuItem value='Portuguese'>Portuguese</MenuItem>
                  <MenuItem value='Italian'>Italian</MenuItem>
                  <MenuItem value='German'>German</MenuItem>
                  <MenuItem value='Arabic'>Arabic</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
            {/* <Grid item xs={12} sm={6}>
              <DatePicker 
                showYearDropdown
                showMonthDropdown
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput />}
                id='form-layouts-separator-date' 
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </Grid>  */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Match date' type="date" placeholder='07-10-2023' onChange={(e) => {setStartDate(e.target.value)}} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Match time' placeholder='00:00' onChange={(e) => {setTime(e.target.value)}} />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={postPrediction}>
            Upload Prediction
          </Button> 
        </CardActions>
      </form>
    </Card>
  )
}

export default FormLayoutsSeparator
