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
} from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material'; 
import { HTTPGetWithToken } from 'src/Services';
import { BASEURL } from 'src/Constant/Link';
import GroupDetailsModal from 'src/@core/components/Modal';

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

  return ( 
    <Box sx={{ padding: 5, minHeight: '100vh' ,backgroundColor:"#fff"}}>
    
      <Grid container spacing={2} sx={{ paddingX: 2 }}>
        <Typography variant="h4" gutterBottom sx={{color:"#000",fontWeight:"bold"}}>
          Groups
        </Typography>

        {group.map((payment: any) => (
          <Grid item xs={12} key={payment.id}>
            <Paper onClick={() => handleGroupPress(payment.id)} elevation={3} sx={{ display: 'flex', alignItems: 'center', padding: 2, borderRadius: 2 }}>
              <Avatar sx={{ marginRight: 2 }} src="/path/to/group/icon.jpg" />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{payment.group_name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {payment.start_date}
                </Typography>
              </Box>
              <Typography variant="h6">₦{payment.group_value.toFixed(2)}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
        <Box>
          {/* Modal content for group details */}
          <GroupDetailsModal
            isVisible={modalVisible}
            onClose={() => setModalVisible(false)}
            groupId={selectedGroupId}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default PaymentRequest;
