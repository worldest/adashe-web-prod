// ** React Imports
import { useState, SyntheticEvent, Fragment, ReactNode, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { useRouter } from 'next/router'; 
import Image from 'next/image';
// ** Icons Imports
import BellOutline from 'mdi-material-ui/BellOutline'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import { BASEURL } from 'src/Constant/Link'
import { HTTPDeleteWithToken, HTTPGetWithToken, HTTPPatchWithToken, HTTPPostWithToken } from 'src/Services'

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
})

// ** Styled Avatar component
const Avatar = styled(MuiAvatar)<AvatarProps>({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const NotificationDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
      )
    }
  }

  const handleAcceptInvitation = async (paymentId) => {
    const user = localStorage.getItem("user");
    if (user === null) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user); // Now it's parsed properly

    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;
 
    try {
      const data = await  HTTPPatchWithToken(`${BASEURL}/group/accept/${paymentId}/${userId}`, {}, token)
      console.log("Grop", data)
      if (data.code === 200) {
        window.alert("Invitation accepted. Notification sent to user");
        getGroup();
      } else {
        window.alert(data.errorMessage);
      }
    } catch (error) {
      window.alert("An error occurred. Please retry.");
    } 
  };

  const handleDeclineInvitation = async (paymentId) => {
    const user = localStorage.getItem("user");
    if (user === null) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user);
    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;

    try { 
      const data = await  HTTPPatchWithToken(`${BASEURL}/group/decline/${paymentId}/${userId}`, {}, token)
      if (data.code === 200) {
        window.alert("Invitation rejected");
        getGroup();
      } else {
        window.alert(data.errorMessage);
      }
    } catch (error) {
      window.alert("An error occurred. Please retry.");
    } 
  };

  const router = useRouter();
  const [group, setGroup] = useState([]);
  const [Country, setCountry] = useState("+234");
  const [notificationsPending, setNotificationPending] = useState([])
  const [date, setDate] = useState("");
  const [profileimg, setprofileimg] = useState(null);
  const [groups, setGroups] = useState([]); // Initialize your group data
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); 
  const handleGroupPress = (groupId) => {
    setSelectedGroupId(groupId);
    setModalVisible(true);
  };

  const [isInWishlist, setIsInWishlist] = useState(false);
  // Sample payment data
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  const [amount, setAmount] = useState(false);

  const handlePaymentRequest = () => {
    // Implement logic for handling payment request
    console.log('Payment requested for amount:', amount);
    // Reset amount after submitting the request
    // setAmount('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getGroup = () => { 
    const user = localStorage.getItem("user"); 
  if (user === null) {
    router.push('/pages/login');
    return;
  }

  const parsedUser = JSON.parse(user); // Now it's parsed properly
   
  const userId = parsedUser.user.user_id; 
  const token = parsedUser.user.token;   
    HTTPGetWithToken(`${BASEURL}/group/member/pending/${userId}`, token)
      .then(data => {
        console.log(data)
        if (data.code === 200) {
          const payload = data.payload.map(item => {
            if (item.start_date) {
              item.start_date = formatDate(item.start_date);
              setDate(item.start_date)
            }
            return item;
          });


          setGroup(payload);

        } else {
          // Handle error cases
          console.error('Error fetching KYC data:', data.message); 
        }
      })
      .catch(error => {
        // Handle request errors
        console.error('Error making HTTP request:', error);
      });

    
    HTTPGetWithToken(`${BASEURL}/group/member/request/${userId}`,token)
      .then(data => {
        if (data.code == 200) {
          setNotificationPending(data.payload)
          console.log("DATA", data.payload)
        } else {

        }
      })
      .catch(error => {
        
      })
  };


  useEffect(() => { 
    getGroup()
  }, []);

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <BellOutline />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            {/* <Chip
              size='small'
              label='8 New'
              color='primary'
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            /> */}
          </Box>
        </MenuItem>
        <ScrollWrapper>
        <div style={{ padding: '15px' }}>  
            <p>Pending group invites</p>
            {group.map((payment) => (
              <div
                key={payment.id}
                style={{
                  backgroundColor: "#f0f0f0", 
                  borderRadius: "10px",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                  width: "98%",
                  margin: "auto",
                  padding: "15px",
                  marginBottom: "20px",
                }}
              > 
              <div
                onClick={() => handleGroupPress(payment.id)}
                style={{
                  display: "flex",
                  alignItems: "center", 
                  background:"#fff", 
                  borderRadius: "10px",
                }}
              >
                <div style={{marginLeft:8}}>
                  <Image
                    src='/images/user_10968773.png' // Assuming your image is located at public/image/logo.png
                    alt='Logo'
                    width={30}
                    height={30}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                  <div style={{marginLeft:10}}>
                    <h3 style={{fontSize:16,color:"#000"}}>{payment.group_name}</h3>
                    <p style={{fontSize:12}}>{payment.created_at.replace("T", " ").replace("000Z", "")}</p>
                  </div>
                  <p style={{fontSize:14,color:"#000",fontWeight:"bold",marginLeft:10}}>₦{payment.amount} ({payment.payment_interval})</p>
                </div>
                <p style={{ color: "red", textAlign: "center" }}>
                  Invited by: {payment.first_name} {payment.last_name}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "#00800020",
                      width: "120px",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                    onClick={() => window.alert("Long press to accept invitation")}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleAcceptInvitation(payment.id);
                    }}
                  >
                    Accept
                  </button>
                  <button
                    style={{
                      backgroundColor: "#FF000020",
                      width: "120px",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                    onClick={() => window.alert("Long press to reject invitation")}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleDeclineInvitation(payment.id);
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
            {notificationsPending.map((payment) => (
              <div
                key={payment.id}
                style={{
                  backgroundColor: "#f0f0f0", 
                  borderRadius: "10px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                  width: "98%",
                  margin: "auto",
                  padding: "10px", 
                  marginBottom: "20px",
                }}
              >
                <div
                  onClick={() => handleGroupPress(payment.id)}
                  style={{
                    display: "flex",
                    alignItems: "center", 
                    background:"#fff", 
                    borderRadius: "10px",
                  }}
                >
                  <div style={{marginLeft:8}}>
                  <Image
                    src='/images/user_10968773.png' // Assuming your image is located at public/image/logo.png
                    alt='Logo'
                    width={30}
                    height={30}
                    style={{ objectFit: 'contain' }}
                  />
                  </div>
                  <div style={{marginLeft:10}}>
                    <h3 style={{fontSize:16,color:"#000"}}>{`${payment.first_name} ${payment.last_name}`}</h3>
                    <p style={{fontSize:12,}}>{payment.created_at.replace("T", " ").replace("000Z", "")}</p>
                  </div>
                </div>
                <p style={{ color: "red", textAlign: "center" }}>
                  Sends a request to join "{payment.group_name}"
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "#00800020",
                      width: "120px",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                    onClick={() => window.alert("Long press to accept invitation")}
                    onContextMenu={async (e) => {
                      e.preventDefault();
                      const user = localStorage.getItem("user");
                      if (user === null) {
                        router.push('/pages/login');
                        return;
                      }
                  
                      const parsedUser = JSON.parse(user); // Now it's parsed properly
                  
                      const userId = parsedUser.user.user_id;
                      const token = parsedUser.user.token;
                   
                      var body = {
                        userid:userId,
                        invited_userid: payment.user_phone,
                        group_id: payment.group_id
                      }
                      try {
                        const data = await HTTPPostWithToken(`${BASEURL}/group/invite`,body,token);
                        console.log("Grop", data)
                        if (data.code === 200) {
                          window.alert("Invitation accepted. Notification sent to user");
                          getGroup();
                        } else {
                          window.alert(data.errorMessage);
                        }
                      } catch (error) {
                        window.alert("An error occurred. Please retry.");
                      }
 
                    }}
                  >
                    Accept
                  </button>
                  <button
                    style={{
                      backgroundColor: "#FF000020",
                      width: "120px",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                    onClick={() => window.alert("Long press to reject invitation")}
                    onContextMenu={async (e) => {
                      e.preventDefault();
                      const user = localStorage.getItem("user");
                      if (user === null) {
                        router.push('/pages/login');
                        return;
                      }

                      const parsedUser = JSON.parse(user);
                      const userId = parsedUser.user.user_id;
                      const token = parsedUser.user.token;

                      try { 
                        const data = await  HTTPDeleteWithToken(`${BASEURL}/group/member/request/${userId}/${payment.id}`, {},token)
                        if (data.code === 200) {
                          window.alert("Invitation rejected");
                          getGroup();
                        } else {
                          window.alert(data.errorMessage);
                        }
                      } catch (error) {
                        window.alert("An error occurred. Please retry.");
                      }
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}

            <div style={{ height: "200px" }}></div>
          </div>
        </ScrollWrapper>
           
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
