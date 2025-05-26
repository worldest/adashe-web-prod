//@ts-nocheck
import { ReactElement, useEffect, useState } from 'react';

// MUI Imports
import { Box, Grid, Card, IconButton, Typography, CardContent, Paper, CardHeader, Button } from '@mui/material';
import { DotsVertical, TrendingUp, CellphoneLink, AccountOutline, AccountGroup, PlusCircle, ArrowRight } from 'mdi-material-ui';
import Image from 'next/image';
import GroupDetailsModal from 'src/@core/components/Modal';
import { HTTPGetWithToken } from 'src/Services';
import { BASEURL } from 'src/Constant/Link';
import { useRouter } from 'next/router'

import { amber } from '@mui/material/colors';
// import { FiShield } from 'react-icons/fi';
// Dummy Data for Active Groups
const activeGroups = [
  {
    id: 1,
    name: 'Group 1',
    description: 'This is group 1 description',
    nextPayment: '2024-10-12',
    createdDate: '2023-01-01',
    amount: 2000
  },
  {
    id: 2,
    name: 'Group 2',
    description: 'This is group 2 description',
    nextPayment: '2024-11-20',
    createdDate: '2023-03-15',
    amount: 1500
  }
];

// StatisticsCard Component
const StatisticsCard = () => {
  const [users, setUsers] = useState(1000); // Example user data
  const [matchs, setMatchs] = useState(500); // Example automatic prediction data
  const [match, setMatch] = useState(300); // Example manual prediction data

  // State to handle modal visibility and the selected group
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [txn, setTxn] = useState([]);
  const [totalCont, setTotalCont] = useState("0.00");
  const [totalPend, setTotalPend] = useState("0.00");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [group, setGroup] = useState([]);
  const router = useRouter()
  const getTrans = async () => {
    const user = localStorage.getItem("user");
    if (user === null) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user); // Now it's parsed properly

    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;

    console.log("User ID:", userId);
    console.log("Token:", token);

    try {
      const data = await HTTPGetWithToken(`${BASEURL}/user/transactions/${userId}`, token);
      console.log("Transaction Data:", data);

      if (data.code === 200) {
        setTxn(data.payload);

        let tot = 0;
        let pend = 0;

        data.payload.forEach(o => {
          if (o.status === 0) pend += parseFloat(o.amount);
          if (o.status === 1) tot += parseFloat(o.amount);
        });

        setTotalCont(tot);
        setTotalPend(pend);

      } else {
        console.error('Error fetching transactions:', data.message);
      }

    } catch (error) {
      console.error('Error making HTTP request:', error);
    }
  };

  const getGroup = async () => {
    const user = localStorage.getItem("user");
    if (user === null) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user); // Now it's parsed properly

    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;

    console.log("User ID:", userId);
    console.log("Token:", token);
    try {
      const data = await HTTPGetWithToken(`${BASEURL}/group/member/${userId}`, token);
      console.log("Grop", data)
      if (data.code === 200) {
        const payload = data.payload.map(item => {
          if (item.start_date) item.start_date = formatDate(item.start_date);
          return item;
        });
        setGroup(payload);
      } else {
        console.error('Error fetching group data:', data.message);
      }
    } catch (error) {
      console.error('Error making HTTP request:', error);
    }
  };

  const getAccount = async () => {
    const user = localStorage.getItem("user");
    if (user === null) {
      router.push('/pages/login');
      return;
    }

    const parsedUser = JSON.parse(user); // Now it's parsed properly

    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;

    console.log("User ID:", userId);
    console.log("Token:", token);
    try {
      const data = await HTTPGetWithToken(`${BASEURL}/user/${userId}`, token);
      console.log("Acc", data)
      if (data.code === 200) {
        setData(data.payload);
      } else {
        console.error('Error fetching account data:', data.message);
      }
    } catch (error) {
      console.error('Error making HTTP request:', error);
    }
  };

  const [totalPayout, setTotalPayout] = useState(0)
  const fetchGroupPayouts = async () => {
    const user = localStorage.getItem("user");
    if (user === null) {
      router.push('/pages/login');
      return;
    }

    if (user) {
      const parsedUser = JSON.parse(user); // Now it's parsed properly

      const userId = parsedUser.user.user_id;
      const token = parsedUser.user.token;


      HTTPGetWithToken(`${BASEURL}/group/payouts/user/${userId}`, token)
        .then(data => {
          console.log("TXN", data)
          if (data.code === 200) {

            setTotalPayout(data.total[0].total)

          } else {
            console.error('Error fetching group data:', data.message);
          }
        })
        .catch(error => {
          console.error('Error making HTTP request:', error);
        })
        .finally(() => {

        });
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };



  useEffect(() => {
    getAccount();
    getTrans();
    getGroup();
    fetchGroupPayouts()
  }, []);
  // Data for the statistics
  const salesData = [
    {
      stats: `${users}`,
      title: 'Create Group',
      color: 'success',
      icon: <PlusCircle sx={{ fontSize: '1.75rem', color: '#000' }} />,
      path: '/CreateAccount'
    },
    {
      stats: `${matchs}`,
      title: 'Groups',
      color: 'primary',
      icon: <AccountGroup sx={{ fontSize: '1.75rem', color: '#000' }} />,
      path: '/Groups'
    }
  ];

  // Render Stats Section
  const renderStats = () => {
    return salesData.map((item, index) => (
      <Grid item xs={2} sm={2} key={index}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            onClick={() => router.push(item.path)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              backgroundColor: '#f9e7e590',
              borderRadius: '15px',
              mb: 2
            }}
          >
            {item.icon}
          </Box>
          <Typography sx={{ color: '#000' }} fontWeight="bold" variant="caption">
            {item.title}
          </Typography>
        </Box>
      </Grid>
    ));
  };

  // Render Contribution & Payout Boxes
  const renderBoxes = () => {
    const statsData = [
      { id: 1, title: 'Total Contribution', amount: `₦ ${totalCont}` },
      { id: 2, title: 'Total Payout', amount: `₦ ${totalPayout !== null ? totalPayout : 0}` },
      { id: 2, title: 'My Groups', amount: group.length }
    ];

    return statsData.map((stat) => (
      <Grid item xs={12} sm={4} key={stat.id}>
        <Paper
          style={{ minHeight: 120 }}
          sx={{
            // display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '30px',
            backgroundColor: '#e8f9ed',
            borderRadius: '12px',
            boxShadow: 0
          }}

        >
          {/* Left-aligned Header */}
          <Typography variant="p" sx={{ color: '#000' }} fontWeight="bold">
            {stat.title}
          </Typography>

          {/* Right-aligned Amount */}
          <Typography variant="h5" sx={{ color: '#4fb26e' }} fontWeight="bold">
            {stat.amount}
          </Typography>
        </Paper>
      </Grid>
    ));
  };

  // Render Active Groups
  const renderGroups = () => {
    return group.map((group) => (
      <Paper
        key={group.id}
        onClick={() => handleGroupClick(group.id)} // Trigger modal when clicked
        sx={{
          // display: 'flex',
          display: "inline-block",
          marginRight: 10,
          maxWidth: 300,
          minHeight: 350,
          alignItems: 'center',

          justifyContent: 'space-between',
          // padding: '15px',
          margin: '10px 10px',
          overflow: "hidden",
          border: '2px solid',  // Set a thick border
          backgroundColor: '#e8f9ed',
          borderColor: '#e2e3e5',
          cursor: 'pointer',
          borderRadius: '18px',
          boxShadow: "1px 1px 11px solid #333"
        }}
      >
        {/* Column 1: Avatar */}
        <img src="https://images.unsplash.com/photo-1662144374178-753a74fa28fb?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" style={{ width: "100%", height: "auto" }} />
        <br /><br />
        <Box sx={{ paddingInline: 5, flexBasis: '10%', textAlign: 'right' }}>
          <Typography style={{ padding: 7, color: "#fff", borderRadius: 20, backgroundColor: group.group_status == 1 ? "#000" : group.group_status === "running" ? "#2FAB0690" : "#DB756B", fontWeight: "900", width: 120, textAlign: "center", float: "right", marginBottom: 20 }}>{group.group_status == 1 ? "Inactive" : group.group_status === "running" ? "Running" : "Closed"}</Typography>
        </Box>
        <div style={{ padding: 15 }}>
          <Box sx={{ flexBasis: '10%', textAlign: 'center', marginBottom: 5 }}>
            <Box
              sx={{
                bgcolor: '#fff',
                width: 56,
                height: 56,
                borderRadius: '50%',
                justifyContent: 'center',
                alignContent: 'center'
              }}
            >
              <Image
                src='/images/user_10968773.png' // Assuming your image is located at public/image/logo.png
                alt='Logo'
                width={30}
                height={30}
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Box>

          {/* Column 2: Group Details */}
          <Box sx={{ flexBasis: '70%' }}>
            <Typography variant='h6' sx={{ color: '#000' }} fontWeight='bold'>
              {group.group_name}
            </Typography>
            <Typography variant='body2' sx={{ color: 'red' }}>
              Next Payment: {group.next_payment.substring(0, 10)}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              Created On: {group.start_date}
            </Typography>
          </Box>

          {/* Column 3: Amount */}
          <Box sx={{ flexBasis: '20%', textAlign: 'left' }}>
            <p style={{ fontWeight: "700" }}>Total Contribution:</p>
            <Typography variant='h6' sx={{ lineHeight: .1, color: '#000' }} fontWeight='bold'>
              ₦{group.group_value.toFixed(2)}
            </Typography>
          </Box>
          <Button onClick={() => handleGroupClick(group.id)} style={{ marginTop: 15, float: "right" }}>
            <Typography
              style={{ padding: 7, color: "#fff", borderRadius: 20, justifyContent: "center", alignItems: "center", backgroundColor: "#2FAB0690", fontWeight: "900", width: 120, textAlign: "center", marginBottom: 20 }}
            >
              <span style={{ justifyContent: "center", alignItems: "center", display: "flex" }}><span style={{ fontSize: 12, fontWeight: "700" }}>View</span><span><ArrowRight style={{ fontSize: 18 }} /></span></span>
            </Typography>
          </Button>
        </div>

      </Paper>
    ));
  };

  // Handle group click to open modal
  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setIsModalVisible(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedGroup(null); // Reset selected group
  };

  return (
    <>
      <Card style={{ backgroundColor: "#ffffff", boxShadow: "none" }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <Typography variant='h6' sx={{ color: '#d96b60' }}>
                Welcome,
              </Typography>
              <Typography variant='h6' sx={{ color: '#000', ml: 1 }} fontWeight='bold'>
                {data.first_name}
              </Typography>
            </Box>
          }
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: '2rem !important',
              letterSpacing: '0.15px !important'
            }
          }}
          subheader={null} // Remove subheader if it's not needed
        />

        <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
          <Grid container spacing={2}>
            {/* Render Contribution and Payout Boxes */}
            {renderBoxes()}
          </Grid>
          <Grid container spacing={2} sx={{ mt: 5 }}>
            {/* Render Statistics */}
            {renderStats()}
          </Grid>
          <br />

          {data.user_nin === null ?
            <Paper
              elevation={0}
              sx={{
                backgroundColor: amber[50],
                border: `1px solid ${amber[100]}`,
                borderRadius: 2,
                p: 2,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* <FiShield style={{ color: amber[600], width: 24, height: 24, marginRight: 16 }} /> */}

              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight="600" color={amber[800]}>
                  Account Verification Needed
                </Typography>
                <Typography variant="body2" color={amber[700]}>
                  Upgrade your account to access full features
                </Typography>
              </Box>

              <Button
                onClick={() => router.push('/Kyc')}
                sx={{
                  backgroundColor: amber[100],
                  color: amber[800],
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: 14,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: amber[200],
                  },
                }}
              >
                Upgrade Now
              </Button>
            </Paper>
            : <></>
          }

          <br />

          <Typography variant='h6' sx={{ mt: 4, color: '#d96b60' }}>
            Active Groups
          </Typography>

          {/* Render Active Groups */}
          {renderGroups()}
        </CardContent>
      </Card>

      {/* Group Details Modal */}
      <GroupDetailsModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        groupId={selectedGroup}
      // groupName={selectedGroup.name}
      // groupDescription={selectedGroup.description}
      />
    </>
  );
};

export default StatisticsCard;
