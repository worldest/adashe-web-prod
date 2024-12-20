//@ts-nocheck
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { Button } from '@mui/material'
import { HTTPGet, HTTPPatchNoToken } from 'src/Services'
import { BASEURL } from 'src/Constant/Link'
import { useEffect, useState } from 'react' 
import { useRouter } from 'next/router'

interface RowType {
  age: number
  name: string
  date: string
  email: string
  salary: string
  status: string
  designation: string
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const rows: RowType[] = [
  {
    age: 27,
    status: 'current',
    date: '09/27/2018',
    name: 'Sally Quinn',
    salary: '$19586.23',
    email: 'eebsworth2m@sbwire.com',
    designation: 'Human Resources Assistant'
  },
  {
    age: 61,
    date: '09/23/2016',
    salary: '$23896.35',
    status: 'professional',
    name: 'Margaret Bowers',
    email: 'kocrevy0@thetimes.co.uk',
    designation: 'Nuclear Power Engineer'
  },
  {
    age: 59,
    date: '10/15/2017',
    name: 'Minnie Roy',
    status: 'rejected',
    salary: '$18991.67',
    email: 'ediehn6@163.com',
    designation: 'Environmental Specialist'
  },
  {
    age: 30,
    date: '06/12/2018',
    status: 'resigned',
    salary: '$19252.12',
    name: 'Ralph Leonard',
    email: 'dfalloona@ifeng.com',
    designation: 'Sales Representative'
  },
  {
    age: 66,
    status: 'applied',
    date: '03/24/2018',
    salary: '$13076.28',
    name: 'Annie Martin',
    designation: 'Operator',
    email: 'sganderton2@tuttocitta.it'
  },
  {
    age: 33,
    date: '08/25/2017',
    salary: '$10909.52',
    name: 'Adeline Day',
    status: 'professional',
    email: 'hnisius4@gnu.org',
    designation: 'Senior Cost Accountant'
  },
  {
    age: 61,
    status: 'current',
    date: '06/01/2017',
    salary: '$17803.80',
    name: 'Lora Jackson',
    designation: 'Geologist',
    email: 'ghoneywood5@narod.ru'
  },
  {
    age: 22,
    date: '12/03/2017',
    salary: '$12336.17',
    name: 'Rodney Sharp',
    status: 'professional',
    designation: 'Cost Accountant',
    email: 'dcrossman3@google.co.jp'
  }
]

const statusObj: StatusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  current: { color: 'primary' },
  resigned: { color: 'warning' },
  professional: { color: 'success' }
} 


const TableManualPredictions = () => {  
  const router = useRouter() 
const [match,setMatch] = useState([])
const getUsers = () =>{
  HTTPGet(`${BASEURL}/node/getdata?node=PremiumMatches`)
  .then(data => { 
    if(data.code == 200){
       setMatch(data.payload)
    }
  })
} 
  useEffect(()=>{
     getUsers() 
  },[])
  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>League</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Fixtures</TableCell>
              <TableCell>Prediction</TableCell>
              <TableCell>Category</TableCell> 
              <TableCell>Date</TableCell> 
            </TableRow>
          </TableHead>
          <TableBody>
            {match.map((obj,index) => ( 
              <TableRow hover key={obj.key} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
              <TableCell>{obj.league}</TableCell>
              <TableCell>{obj.sport}</TableCell>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{obj.home + "-" + obj.away}</Typography> 
                  </Box>
                </TableCell>
                <TableCell>{obj.Prediction}</TableCell>
                <TableCell>{obj.category}</TableCell> 
                <TableCell>{obj.match_time+" "+obj.match_date}</TableCell>  
                <TableCell> 
                    <div>
                      <button onClick={()=>{
                        localStorage.setItem("Prediction",`${JSON.stringify(obj)}`) 
                        router.push('/Updateform')
                      }} style={{backgroundColor:"#9155fe",color:"#fff",fontSize:12,fontWeight:"bold",padding:15,border:0,borderRadius:4,}}>Update</button>
                    </div> 
                </TableCell>
                <TableCell> 
                    <div>
                      <button onClick={()=>{
                        var body ={
                          "ref": `PremiumMatches/${obj.key}`,
                          "data": {
                              "Prediction": null,
                              "away": null,
                              "category": null,
                              "home": null,
                              "match_date": null,
                              "match_time": null,
                              "sport": null,
                              "status": null,
                              "league": null
                          } 
                        } 
                        HTTPPatchNoToken(`${BASEURL}/set/updateDataObject`,body)
                        .then(res => {
                          if(res.code == 200){
                            // alert(JSON.stringify(res))
                          }
                        })
                      }}  style={{backgroundColor:"#ef0222",color:"#fff",fontSize:12,fontWeight:"bold",padding:15,border:0,borderRadius:4,}}>Delete</button>
                    </div> 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default TableManualPredictions
