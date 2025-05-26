//@ts-nocheck
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  Modal,
  Box,
  Grid,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  CardMedia,
  Avatar,
  TextField,
  CircularProgress,
  Paper,
  ImageList,
  ImageListItem
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HistoryIcon from '@mui/icons-material/History';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { HTTPGetWithToken, HTTPPatchWithToken, HTTPPostWithToken, } from 'src/Services';
import { BASEURL } from 'src/Constant/Link';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import ScrollBar from 'react-perfect-scrollbar';
import ImageIcon from '@mui/icons-material/Image';
import { useDropzone } from "react-dropzone";
import Message from '../Message';
import MessageModal from '../Message';
import toast, { Toaster } from 'react-hot-toast';
interface GroupDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  groupId: string;
  //   groupName: string;
  //   groupDescription: string;
}
const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  isVisible,
  onClose,
  groupId,
  //   groupName,
  //   groupDescription
}) => {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startingDate, setStartingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [groupTrans, setGroupTrans] = useState([]);
  const [isReceiptSelected, setIsReceiptSelected] = useState("Select Receipt")
  const [user_, setuser] = useState([]);
  const [selectedImage, setSelectedImage] = useState("")
  const [amount, setAmount] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [GroupId, setGroupId] = React.useState("");
  const [auth, setAuth] = useState({ user_id: "", token: "" })
  const [activeTab, setActiveTab] = useState(0);
  const [decision, setDecision] = useState(1)
  const [Phone, setPhone] = useState("")
  const [id, setId] = useState(1)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalType, setModalType] = useState(''); // 'success' or 'warning'
  const [modalMessage, setModalMessage] = useState('');
  const [modalMessage2, setModalMessage2] = useState('');
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [memberArray, setMemberArray] = useState([])
  const [memberArrayCount, setMemberArrayCount] = useState([])
  const [isLoading, setIsLoading] = useState("Send Request")
  const [isLoading2, setIsLoading2] = useState("Invite")
  const [isLoading3, setIsLoading3] = useState(false)
  const [modalVisibles, setModalVisibles] = useState(false);
  const [hismodalVisible, setHisModalVisibles] = useState(false);
  const [paymodalVisible, setPayModalVisibles] = useState(false);
  const [inmodalVisible, setInModalVisibles] = useState(false);
  const [nomodalVisible, setNoModalVisibles] = useState(false);
  const [payouts, setPayouts] = useState([])
  const [totalPayout, setTotalPayout] = useState(0)
  const [message, setMessage] = useState("")
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const data = {
    labels: memberArray, // X-axis labels from your memberArray
    datasets: [
      {
        label: 'Member Count',
        data: memberArrayCount, // Y-axis data from your memberArrayCount
        fill: false,
        backgroundColor: '#4fb26e',
        borderColor: '#4fb26e',
        borderWidth: 3,
      },
    ],
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend if you don't need it
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStartingDate(selectedDate);
    }
  };

  const handleInvite = async () => {
    setIsLoading3(true); // Show loading state if needed

    // Fetch user from localStorage
    const user = localStorage.getItem("user");

    if (!Phone) {
      // Show modal for missing phone number
      setModalVisible(true);
      setModalType('warning');
      toast('Please fill the required fields');
      setIsLoading2('Try Again');


    } else {
      if (user !== null) {
        const parsedUser = JSON.parse(user);

        const userId = parsedUser.user.user_id;
        const token = parsedUser.user.token;

        const body = {
          userid: userId,
          invited_userid: Phone,
          group_id: groupId
        };

        // Post invite request with token
        HTTPPostWithToken(`${BASEURL}/group/invite`, body, token)
          .then((data) => {
            setModalVisible(false);
            console.log(data);

            if (data.code === 200) {
              // Success case
              setModalVisible(true);
              setModalType('success');
              toast(data.message);

              setTimeout(() => {
                setInModalVisibles(false)
              }, 3000);

              // Refresh relevant data
              fetchGroupData();
              fetchGroupTrans();
              fetchGroupPayouts();
            } else if (data.code === 500) {
              // User doesn't exist, trigger SMS invite
              setInModalVisibles(false);
              setPhone('');

              const smsMessage = `Hi, I am inviting you to join my group on Adashe. Download the app on Google Playstore and Apple store to join now`;

              // Trigger SMS invitation (works on mobile devices)
              window.location.href = `sms:${Phone}?body=${encodeURIComponent(smsMessage)}`;
            } else {
              // Other error cases
              setModalVisible(true);
              setModalType('warning');
              setModalMessage(data.errorMessage);
              setIsLoading2('Try Again');
            }
          })
          .catch((error) => {
            // Handle request errors
            console.error('Error inviting user:', error);
            setModalVisible(true);
            setModalType('warning');
            setModalMessage("Please retry");
            setIsLoading2('Try Again');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsReceiptSelected("Uploading, please wait...");
      const formData = new FormData();
      formData.append("file", file);
      fetch("https://payload-x.com/server/cdn/file/upload.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setIsReceiptSelected("Uploaded");
          setSelectedImage(data.link);
        })
        .catch((error) => {
          console.error("Error uploading image", error);
          setIsReceiptSelected("Failed to upload. Try again.");
        });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handlePayout = async () => {
    setIsLoading3(true);
    const user = await localStorage.getItem("user");
    const receiver = user_.find(
      (ex) => ex.payout_status > groupData.group_round && ex.current_round === 1
    );
    const parsedUser = JSON.parse(user); // Now it's parsed properly

    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;
    const body = {
      userid: userId,
      group_id: groupId,
      receiver_id: receiver ? receiver.user_id : "",
      amount: amount,
      receipt: selectedImage,
    };
    console.log(body)
    HTTPPostWithToken(`${BASEURL}/group/processPayout`, body, token)
      .then(data => {
        //console.log(data) 
        setIsLoading3(false)
        if (data.code === 200) {
          setModalVisible(true);
          setModalType('success');
          toast(data.message);
          setTimeout(() => {
            setPayModalVisibles(false)
          }, 3000);
          fetchGroupData();
          fetchGroupTrans();
          fetchGroupPayouts();
        } else {
          setModalVisible(true);
          setModalType('warning');
          toast(data.errormessage);
          setIsLoading('Try again');
        }
      })
      .catch(error => {
        setModalVisible(true);
        setModalType('warning');
        toast("please retry");
        setIsLoading('Try again');
        onClose()
      })
      .finally(() => {
        setLoading(false);
      });

  }
  const scrollViewRef = useRef();
  const openChatModal = () => {
    setChatModalOpen(true)
    fetchGroupChats()
    clearInterval(interval_)
    interval_ = setInterval(() => {
      fetchGroupChats()
    }, 5000)
  };
  const closeChatModal = () => setChatModalOpen(false);

  const openNotificationsModal = () => setNotificationsModalOpen(true);
  const closeNotificationsModal = () => setNotificationsModalOpen(false);
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedUsers = Array.from(users);
    const [removed] = reorderedUsers.splice(result.source.index, 1);
    reorderedUsers.splice(result.destination.index, 0, removed);
    setUsers(reorderedUsers);
  };
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsReceiptSelected("Uploading, please wait...");

      const payload = new FormData();
      payload.append("file", file);

      try {
        const response = await fetch("https://payload-x.com/server/cdn/file/upload.php", {
          headers: {
            // MUI doesn't require multipart header; fetch handles it
          },
          method: "POST",
          body: payload,
        });
        const data = await response.json();
        setIsReceiptSelected("Uploaded");
        setSelectedImage(data.link); // Assuming "link" is the image URL
      } catch (error) {
        console.log(error);
        setIsReceiptSelected("Failed to upload");
      }
    }
  };

  // Render a single user item
  const renderItem = (user, index) => (
    <Draggable key={user.user_id} draggableId={`${user.user_id}`} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            padding: '10px',
            backgroundColor: snapshot.isDragging ? '#f0f0f0' : '#fff',
            borderRadius: '8px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: snapshot.isDragging ? '0px 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          <Avatar
            src={require('../../../../public/images/user_10968773.png')}
            alt={`${user.first_name} ${user.last_name}`}
            sx={{ width: 35, height: 35, marginRight: '15px' }}
          />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: "#000" }}>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: '6px', color: 'gray' }}>
              {user.created_at.substring(0, 19)}
            </Typography>
          </Box>
        </Box>
      )}
    </Draggable>
  );

  const handlePaymentRequest = async () => {
    const user = await localStorage.getItem("user");


    if (amount === "") {
      setModalVisible(true);
      setModalType('warning');
      setModalMessage('Please fill the required fields');
      setIsLoading('Try Again');


    } else {
      if (user) {
        const parsedUser = JSON.parse(user); // Now it's parsed properly

        const userId = parsedUser.user.user_id;
        const token = parsedUser.user.token;

        var body = {
          userid: userId,
          group_id: groupId,
          amount: amount,
          receipt: selectedImage,
          comment: comment
        }
        // setIsLoading(<ActivityIndicator size={"small"} color={"#fff"} />);
        HTTPPostWithToken(`${BASEURL}/payments/submit_request/`, body, token)
          .then(data => {
            //console.log(data)
            if (data.code === 200) {
              setModalVisible(true);
              setModalType('success');
              toast(data.message);
              setIsLoading('Proceed');
              fetchGroupData();
              fetchGroupTrans();
              fetchGroupPayouts();
            } else {
              setModalVisible(true);
              setModalType('warning');
              toast(data.errormessage);
              setIsLoading('Try again');
            }
          })
          .catch(error => {
            setModalVisible(true);
            setModalType('warning');
            toast("please retry");
            setIsLoading('Try again');
            onClose()
          })
          .finally(() => {
            setLoading(false);
          });

      }
    }
  };

  const handleApprovePress = async () => {
    setConfirmModalVisible(true);

  };

  const handleConfirm = async () => {
    setConfirmModalVisible(false);
    const user = await localStorage.getItem("user");
    const parsedUser = JSON.parse(user); // Now it's parsed properly

    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;

    var body = {
      userid: userId,
      txnid: id,
      decision: decision
    }

    HTTPPatchWithToken(`${BASEURL}/payments/decide`, body, token)
      .then(data => {
        setConfirmModalVisible(false);
        //console.log(data)
        if (data.code === 200) {
          setModalVisible(true);
          setModalType('success');
          toast(data.message);
          setIsLoading('Proceed');
          fetchGroupData()
          fetchGroupTrans()
        } else {
          setModalVisible(true);
          setModalType('warning');
          toast(data.errormessage);
          setIsLoading('Try again');
        }
      })
      .catch(error => {
        setConfirmModalVisible(false);
        setModalVisible(true);
        setModalType('warning');
        toast("please retry");
        setIsLoading('Try again');
        onClose()
      })
      .finally(() => {
        setConfirmModalVisible(false);
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  const fetchGroupData = async () => {
    const user = await localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user); // Now it's parsed properly

      const userId = parsedUser.user.user_id;
      const token = parsedUser.user.token;

      HTTPGetWithToken(`${BASEURL}/group/fetch/${groupId}`, token)
        .then(data => {
          //console.log(data)
          if (data.code === 200) {

            setGroupData(data.payload)
            setGroupId(data.payload.id)
            setuser(data.members);
            setUserDummy(data.members)
            const members_ = data.members;
            members_.map
          } else {
            console.error('Error fetching group data:', data.message);
          }
        })
        .catch(error => {
          console.error('Error making HTTP request:', error);
        })
        .finally(() => {
          setLoading(false);
        });

    }
  };
  const fetchGroupTrans = async () => {
    const user = await localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user); // Now it's parsed properly

      const userId = parsedUser.user.user_id;
      const token = parsedUser.user.token;

      HTTPGetWithToken(`${BASEURL}/group/transactions/${groupId}`, token)
        .then(data => {
          //console.log("TXN", data)
          if (data.code === 200) {
            setMemberArray([])
            setMemberArrayCount([])
            setRefresh(!refresh)
            setGroupTrans(data.payload)
            const txn_ = data.payload || [];
            HTTPGetWithToken(`${BASEURL}/group/fetch/${groupId}`, token)
              .then(data => {
                //console.log(data)
                if (data.code === 200) {
                  const members_ = data.members;
                  let tempArray = memberArray;
                  let tempCount = memberArrayCount;
                  members_.map((o) => {
                    tempArray.push(o.first_name)
                    const userID = o.user_id;
                    let len = txn_.filter(ex => ex.user_id === userID)
                    tempCount.push(len.length);
                  })

                  setMemberArray(tempArray)
                  setMemberArrayCount(tempCount)
                  //console.log("MemberArray", memberArray)
                  //console.log("MemberArrayCount", memberArrayCount)
                  setRefresh(!refresh)
                } else {
                  console.error('Error fetching group data:', data.message);
                }
              })
              .catch(error => {
                console.error('Error making HTTP request:', error);
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            console.error('Error fetching group data:', data.message);
          }
        })
        .catch(error => {
          console.error('Error making HTTP request:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const fetchGroupPayouts = async () => {
    const user = await localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user); // Now it's parsed properly

      const userId = parsedUser.user.user_id;
      const token = parsedUser.user.token;

      HTTPGetWithToken(`${BASEURL}/group/payouts/${groupId}`, token)
        .then(data => {
          console.log("TXN", data)
          if (data.code === 200) {
            setPayouts(data.payload)
            setTotalPayout(data.total[0].total)
            setRefresh(!refresh)
          } else {
            console.error('Error fetching group data:', data.message);
          }
        })
        .catch(error => {
          console.error('Error making HTTP request:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const handleAccept = async (payoutId: string) => {
    const user = await localStorage.getItem("user");
    const parsedUser = JSON.parse(user); // Now it's parsed properly

    const userId = parsedUser.user.user_id;
    setLoading(true);
    const body = {
      userid: userId,
      payout_id: payoutId,
    };

    try {
      const response = await fetch(`${BASEURL}/group/acceptPayout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (data.code === 200) {
        setModalVisible(true);
        fetchGroupData();
        fetchGroupTrans();
        fetchGroupPayouts();
      }
    } catch (error) {
      console.error("Failed to accept payout:", error);
    } finally {
      setLoading(false);
    }
  };
  const [userDummy, setUserDummy] = useState([
    {
      first_name: "",
      last_name: "",
      user_id: "",
      payout_status: 0
    }
  ])
  useEffect(() => {
    if (isVisible) {
      fetchGroupData();
      fetchGroupTrans();
      fetchGroupPayouts();
    }
  }, [isVisible]);

  useEffect(() => {
    const user_auth = localStorage.getItem("user");

    if (user_auth !== null) {
      const parsedUser = JSON.parse(user_auth); // Parse the user object
      const userId = parsedUser.user.user_id;
      const token = parsedUser.user.token;

      // Set the auth state with the user_id and token
      setAuth({ user_id: userId, token: token });
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 seconds delay for loading indicator

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, []);
  const fetchGroupChats = async () => {
    const user = await localStorage.getItem("user");

    if (user && groupId !== null) {
      console.log(groupId)
      const parsedUser = JSON.parse(user);
      const userId = parsedUser.user.user_id;
      const token = parsedUser.user.token;
      HTTPGetWithToken(`${BASEURL}/group/chats/${groupId}`, token)
        .then(data => {
          //console.log("TXN", data)
          if (data.code === 200) {
            setChats(data.payload)
            setRefresh(!refresh)
          } else {
            console.error('Error fetching group data:', data.message);
          }
        })
        .catch(error => {
          console.error('Error making HTTP request:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  let interval_ = setInterval(() => {

  }, 5000)
  useEffect(() => {
    if (user_ && user_.length > 0) {
      setUsers(user_);
    }
  }, [user_]);
  return (
    <Modal open={isVisible} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '90%' },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: '12px',
          p: 4,
          overflow: 'auto'
        }}
      >
        <Toaster />
        {/* Header Row */}
        <Grid container justifyContent="space-between">
          {/* Group Name and Description */}
          <Grid item xs={10}>
            <Typography variant="h6" sx={{ color: '#000' }} fontWeight='bold'>{groupData.group_name}</Typography>
            <Typography variant="subtitle1" sx={{ color: '#000' }}>{groupData.group_desc}</Typography>
          </Grid>

          {/* Close Icon */}
          <Grid item xs={2} textAlign="right">
            <IconButton onClick={onClose} sx={{ backgroundColor: 'red', color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* Chat and Notification Row */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={6} textAlign="center">
            <IconButton onClick={openChatModal}>
              <ChatIcon sx={{ color: "#4fb26e" }} fontSize="large" />
            </IconButton>
            <Typography sx={{ color: '#000' }}>Chat</Typography>
          </Grid>
          <Grid item xs={6} textAlign="center">
            <IconButton onClick={openNotificationsModal}>
              <NotificationsIcon sx={{ color: "#4fb26e" }} fontSize="large" />
            </IconButton>
            <Typography sx={{ color: '#000' }}>Notifications</Typography>
          </Grid>
        </Grid>

        {/* Contribution and Payment Information */}
        <Grid container spacing={2} mt={3}>
          {/* First Row */}
          <Grid item xs={6}>
            <Card sx={{
              backgroundColor: '#e8f9ed',
              borderColor: '#e2e3e5',
              boxShadow: 0
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: '#000' }}>Total Contribution</Typography>
                <Typography variant="p" sx={{ color: '#000' }}>₦ {parseFloat(groupData.group_value).toLocaleString("en")}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{
              backgroundColor: '#e8f9ed',
              borderColor: '#e2e3e5',
              boxShadow: 0
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: '#000' }}>Total Payout</Typography>
                <Typography variant="p" sx={{ color: '#000' }}>₦ {parseFloat(totalPayout).toLocaleString("en")}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Second Row */}
          <Grid item xs={6}>
            <Card sx={{
              backgroundColor: '#e8f9ed',
              borderColor: '#e2e3e5',
              boxShadow: 0
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: '#000' }}>Payment Interval</Typography>
                <Typography variant="p" sx={{ color: '#000' }}>{groupData.payment_interval}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{
              backgroundColor: '#e8f9ed',
              borderColor: '#e2e3e5',
              boxShadow: 0
            }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: '#000' }}>Amount to Pay</Typography>
                <Typography variant="p" sx={{ color: '#000' }}>₦ {parseFloat(groupData.amount).toLocaleString("en")}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Third Row */}
          <Grid item xs={6}>
            <Card sx={{
              backgroundColor: '#e8f9ed',
              borderColor: '#e2e3e5',
              boxShadow: 0
            }}>
              <CardContent>
                <Typography sx={{ color: '#000' }} variant="body2">Next Payment</Typography>
                <Typography sx={{ color: '#000' }} variant="p">{groupData.next_payment ? groupData.next_payment.replace("T", " ").replace(".000Z", "") : "..."}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{
              backgroundColor: '#e8f9ed',
              borderColor: '#e2e3e5',
              boxShadow: 0
            }}>
              <CardContent>
                <Typography sx={{ color: '#000' }} variant="body2">Next Payout Collector</Typography>
                <Typography sx={{ color: '#000' }} variant="p"> {
                  userDummy.filter(ex => parseInt(ex.payout_status) > 0).length > 0 ?
                    userDummy.filter(ex => parseInt(ex.payout_status) == 1)[0].first_name :
                    userDummy[0].first_name
                }{" "}{
                    userDummy.filter(ex => parseInt(ex.payout_status) > 0).length > 0 ?
                      userDummy.filter(ex => parseInt(ex.payout_status) == 1)[0].last_name :
                      userDummy[0].last_name
                  }</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Horizontal Tabs Section */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            mt: 3,
            mb: 2,
            '& .MuiTabs-indicator': {
              backgroundColor: 'green',
            },
            '& .Mui-selected': {
              color: 'lightgreen !important',
            },
          }}
        >
          <Tab label="Members" />
          <Tab label="Payouts" />
          <Tab label="Payment Notification" />
        </Tabs>

        {/* Tab Contents */}
        {activeTab === 0 && (
          <>
            {/* Line Chart */}
            <Box sx={{ width: '95%', margin: '0 auto' }}>
              {/* {memberArray.length > 0 && memberArrayCount.length > 0 ? ( */}
              <Box sx={{ width: '95%', margin: '0 auto', height: "220px" }}>
                <Line data={data} options={options} />
              </Box>
              {/* ) : (
                    <CircularProgress size={40} sx={{ color:"#4fb26e" }} />
                )} */}
            </Box>

            {/* Members List */}
            {groupData.host === auth.user_id ? (
              user_.map((o, i) => (
                <Grid container alignItems="center" spacing={2} key={i} sx={{ marginY: 1 }}>
                  <Paper
                    key={user_.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '15px',
                      margin: '10px 0',
                      backgroundColor: '#e8f9ed',
                      border: '2px solid',  // Set a thick border
                      borderColor: '#4fb26e', // Border color
                      width: '100%',  // Set the width to 95%
                      cursor: 'pointer',
                      borderRadius: '8px',
                      boxShadow: 0
                    }}
                  >
                    <Grid item xs={3} sx={{ borderWidth: "10px", borderColor: "#4fb26e" }}>
                      <Image
                        src='/images/user_10968773.png' // Assuming your image is located at public/image/logo.png
                        alt='Logo'
                        width={30}
                        height={30}
                        style={{ objectFit: 'contain' }}
                      />
                    </Grid>

                    {/* Member Details */}
                    <Grid item xs={6}>
                      <Typography variant="body1">{o.first_name} {o.last_name}</Typography>
                      <Typography variant="caption">{o.created_at.substring(0, 19)}</Typography>
                    </Grid>

                    {/* Remove Button */}
                    <Grid item xs={4} sx={{ alignContent: "flex-end", alignItems: "flex-end" }}>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 2, alignSelf: "flex-end" }}
                        onClick={() => {
                          // Remove user logic here
                        }}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Paper>
                </Grid>
              ))
            ) : null}

            {/* Extra Space */}
            <Box sx={{ height: 100 }} />
          </>
        )}
        {activeTab === 1 && (
          <Box sx={{ mb: 40 }}>
            <>
              {payouts.map((o, i) => {
                return (
                  <Box
                    key={i}
                    sx={{
                      backgroundColor:
                        o.status === 1 ? '#bef4ce' : o.status === 0 ? '#f4deb2' : '#f4b2b2',
                      padding: 2,
                      borderRadius: 2,
                      marginY: 1,
                    }}
                  >
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Typography variant="h6">
                          {o.first_name} {o.last_name}
                        </Typography>
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                          {o.created_at.substring(0, 19)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" sx={{ fontSize: 14, color: '#000' }}>
                          ₦ {o.amount}
                        </Typography>
                      </Grid>
                    </Grid>

                    {o.receipt ? (
                      <Button
                        onClick={() => window.open(o.receipt, '_blank')}
                        sx={{ marginTop: 2, borderRadius: 2, overflow: 'hidden' }}
                      >
                        <Image src={o.receipt} alt="Receipt" width={300} height={120} style={{ width: '100%', height: 'auto' }} />
                      </Button>
                    ) : null}
                  </Box>
                );
              })}
              <Box sx={{ height: 200 }} />
            </>
          </Box>
        )}
        {activeTab === 2 && (
          <Box>
            <>
              <Box sx={{ padding: 2 }}>
                {/* Amount Input */}
                <Typography sx={{ marginBottom: 1 }}>Amount</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter amount"
                  type="number"
                  value={amount}
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

                {/* Image Upload */}
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    backgroundColor: "#f7f7f7",
                    color: "black",
                    width: "100%",
                    padding: 2,
                    borderRadius: 2,
                    marginBottom: 2,
                    '&:hover': { // Define the hover state here
                      backgroundColor: "#d96b60",
                    },
                  }}
                >
                  {isReceiptSelected}
                  <input type="file" hidden onChange={handleImageUpload} />
                </Button>

                {isReceiptSelected === "Uploaded" && selectedImage && (
                  <Box sx={{ textAlign: "center", marginY: 2 }}>
                    <img
                      src={selectedImage}
                      alt="Uploaded Receipt"
                      style={{
                        width: 250,
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 8,

                      }}
                    />
                  </Box>
                )}

                {/* Comment Input */}
                <Typography sx={{ marginBottom: 1 }}>Comment</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
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

                {/* Submit Button */}
                <Button
                  onClick={handlePaymentRequest}
                  sx={{
                    width: "95%",
                    height: 60,
                    borderRadius: 2,
                    backgroundColor: "#4fb26e",
                    color: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    marginTop: 3,
                    boxShadow: 8,
                    '&:hover': { // Define the hover state here
                      backgroundColor: "#d96b60",
                    },
                  }}
                >
                  Proceed
                </Button>
              </Box>

              {/* Extra space */}
              <Box sx={{ height: 100 }} />
            </>
          </Box>
        )}

        {/* Bottom Fixed Tabs */}

        {groupData.host === auth.user_id && (
          <Grid
            container
            justifyContent="space-around"
            sx={{
              position: 'sticky', // Keeps it at the bottom of the parent
              bottom: 0,
              backgroundColor: '#fff',
              borderTop: '1px solid #ddd',
              py: 2,
            }}
          >
            <Grid item xs={3} textAlign="center">
              <IconButton onClick={() => setModalVisibles(true)}>
                <ManageAccountsIcon sx={{ color: '#4fb26e' }} />
              </IconButton>
              <Typography sx={{ color: '#000', fontSize: 12, fontWeight: "bold" }} variant="body2">
                Manage Group
              </Typography>
            </Grid>

            <Grid item xs={3} textAlign="center">
              <IconButton onClick={() => setHisModalVisibles(true)}>
                <HistoryIcon sx={{ color: '#4fb26e' }} />
              </IconButton>
              <Typography sx={{ color: '#000', fontSize: 12, fontWeight: "bold" }} variant="body2">
                Contribution History
              </Typography>
            </Grid>

            <Grid item xs={3} textAlign="center">
              <IconButton onClick={() => setPayModalVisibles(true)}>
                <AttachMoneyIcon sx={{ color: '#4fb26e' }} />
              </IconButton>
              <Typography sx={{ color: '#000', fontSize: 12, fontWeight: "bold" }} variant="body2">
                Process Payout
              </Typography>
            </Grid>

            <Grid item xs={3} textAlign="center">
              <IconButton onClick={() => setInModalVisibles(true)}>
                <PersonAddIcon sx={{ color: '#4fb26e' }} />
              </IconButton>
              <Typography sx={{ color: '#000', fontSize: 12, fontWeight: "bold" }} variant="body2">
                Invite
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* Chat Modal */}
        <Modal open={chatModalOpen} onClose={closeChatModal}>
          <div style={{ backgroundColor: "#f0f0f0", paddingTop: 20, height: '100%', position: 'relative' }}>
            <IconButton
              onClick={() => { closeChatModal() }}
              style={{ position: 'absolute', left: 20, padding: 5, backgroundColor: "#4fb26e", color: "#fff" }}
            >
              <ArrowBackIcon fontSize="large" />
            </IconButton>

            {/* Chat Messages */}
            <div
              ref={scrollViewRef}
              style={{ overflowY: 'auto', height: '90%', padding: '10px 20px' }}
            >
              <p style={{ textAlign: 'center', marginBottom: 10 }}>---Chat Started---</p>
              {
                chats.map((o, i) => {
                  return (
                    <div key={i}
                      style={{
                        alignSelf: o.user_id === auth.user_id ? 'flex-end' : 'flex-start',
                        backgroundColor: o.user_id === auth.user_id ? `#4fb26e` : "#fff",
                        width: 300,
                        marginVertical: 10,
                        marginHorizontal: 10,
                        borderRadius: 10,
                        padding: 15,
                        marginBottom: '10px',
                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <p style={{ fontSize: 12 }}>{o.username}</p>
                      <p style={{ fontSize: 14 }}>{o.message}</p>
                      <p style={{ fontSize: 12, textAlign: 'right' }}>{o.created_at.substring(0, 19).replace("T", " ")}</p>
                    </div>
                  );
                })
              }
            </div>

            {/* Chat Input */}
            <div style={{ height: '10%', padding: '0 10px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '88%', display: 'flex', alignItems: 'center' }}>
                <textarea
                  value={message}
                  style={{ backgroundColor: "#e2e3e550", padding: 15, borderRadius: 10, height: 55, width: '100%', resize: 'none', border: '1px solid #ccc' }}
                  placeholder='Enter Chat'
                  rows={2}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div style={{ width: '10%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <button
                  style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                  onClick={async () => {
                    setMessage("");
                    const user = await localStorage.getItem("user");
                    const parsedUser = JSON.parse(user);
                    var body = {
                      userid: parsedUser.user_id,
                      // group_id: groupId,
                      message: message
                    };
                    HTTPPostWithToken(`${BASEURL}/group/sendMessage`, body, parsedUser.token)
                      .then(data => {
                        // handle success
                      })
                      .catch(error => {
                        // handle error
                      })
                      .finally(() => {
                        // final actions
                      });
                  }}
                >
                  <SendIcon fontSize="large" style={{ color: "#4fb26e" }} />
                </button>
              </div>
            </div>
          </div>
        </Modal>


        {/* Notifications Modal */}
        <Modal open={notificationsModalOpen} onClose={closeNotificationsModal}>
          <Box sx={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxHeight: '90vh', maxWidth: "100vh", margin: '5vh auto', overflowY: 'auto', position: 'relative', }}>
            {/* Header with Close Button */}
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="h2">
                Notifications
              </Typography>
              <IconButton sx={{ backgroundColor: 'red', color: '#fff' }}
                onClick={closeNotificationsModal}
              >
                <CloseIcon style={{ color: "#fff" }} />
              </IconButton>
            </Grid>

            {/* Notifications Content */}
            <ScrollBar>
              {payouts
                .filter((ex) => ex.status === 0)
                .map((o, i) => (
                  <Box
                    key={i}
                    sx={{
                      backgroundColor: o.status === 1 ? "#bef4ce" : o.status === 0 ? "#f4deb2" : "#f4b2b2",
                      p: 2,
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography>{o.first_name} {o.last_name}</Typography>
                        <Typography sx={{ mt: 1, fontSize: 14 }}>
                          {o.created_at.substring(0, 19)}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 14, color: "#000" }}>
                        ₦ {o.amount}
                      </Typography>
                    </Box>

                    {o.receipt && (
                      <ImageList sx={{ mt: 2 }} cols={1}>
                        <ImageListItem>
                          <img
                            src={o.receipt}
                            alt="Receipt"
                            loading="lazy"
                            style={{ borderRadius: 8 }}
                          />
                        </ImageListItem>
                      </ImageList>
                    )}

                    {o.status === 0 && o.host === auth.user_id && (
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => handleAccept(o.id)}
                        disabled={loading}
                      >
                        Accept
                      </Button>
                    )}
                  </Box>
                ))}
            </ScrollBar>
          </Box>
        </Modal>

        {/* manage g */}
        <Modal
          open={modalVisibles} // Modal should appear when modalVisibles is true
          onClose={() => setModalVisibles(null)}
        >
          <Box sx={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxHeight: '90vh', maxWidth: "100vh", margin: '5vh auto', overflowY: 'auto', position: 'relative' }}>
            {/* Header with Close Button */}
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", color: "#000" }} >
                Manage Group
              </Typography>
              <IconButton
                sx={{ backgroundColor: 'red', color: '#fff' }}
                onClick={() => setModalVisibles(null)}
              >
                <CloseIcon style={{ color: "#fff" }} />
              </IconButton>
            </Grid>

            {/* Manage Group Content */}
            <ScrollBar style={{ height: '70vh' }}>
              {groupData.group_status === "running" ? (
                <>
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>Drag to arrange members</Typography>
                  {/* Render draggable list of members */}
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="usersList">
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{ width: '100%' }}
                        >
                          {users.map((user, index) => renderItem(user, index))}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </DragDropContext>
                </>
              ) : (
                <>
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>Manage Group</Typography>

                  {/* Start Date Picker */}
                  <Typography >Pick a start date</Typography>
                  <Box sx={{
                    width: "100%",
                    height: 60,
                    justifyContent: "center",
                    backgroundColor: "#f7f7f7",
                    borderRadius: 12,
                    paddingLeft: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }} onClick={() => setShowDatePicker(true)}>
                    <Typography>{startingDate instanceof Date && !isNaN(startingDate) ? startingDate.toLocaleDateString() : 'Select date'}</Typography>
                  </Box>

                  {showDatePicker && (
                    <DatePicker
                      value={startingDate}
                      onChange={(newDate) => {
                        setStartingDate(new Date(newDate)); // Ensure valid Date object
                        setShowDatePicker(false); // Close the date picker after selection
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  )}

                  {/* Start Group Button */}
                  <Button
                    variant="contained"
                    sx={{
                      width: "100%",
                      height: '45px',
                      borderRadius: '16px',
                      backgroundColor: "#4fb26e",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: '10px',
                      '&:hover': { // Define the hover state here
                        backgroundColor: "#d96b60",
                      },
                    }}
                    onClick={async () => {
                      setIsLoading3(true);
                      const user = await localStorage.getItem("user");
                      const parsedUser = JSON.parse(user); // Parse the stored user

                      const userId = parsedUser.user.user_id;
                      const token = parsedUser.user.token;

                      // Format the start date as MM-DD-YYYY
                      const formattedDate = startingDate instanceof Date && !isNaN(startingDate)
                        ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(startingDate)
                        : '';

                      const body = {
                        userid: userId,
                        start_date: formattedDate, // Use formatted date here
                        group_id: groupId,
                      };

                      console.log("BOB", body);

                      // Convert the body object to a JSON string
                      // const bodyString = JSON.stringify(body);

                      HTTPPostWithToken(`${BASEURL}/group/startGroup`, body, token)
                        .then(data => {
                          console.log("PES", data);
                          if (data.code === 200) {
                            setIsLoading3(false);
                            setModalVisible(true);
                            setModalType('success');
                            setModalMessage(data.message);
                            setTimeout(() => {
                              setModalVisible(false);
                            }, 3000);
                            fetchGroupData();
                            fetchGroupTrans();
                            fetchGroupPayouts();
                          } else {
                            setIsLoading3(false);
                            setModalVisible(true);
                            setModalType('warning');
                            toast(data.errorMessage);
                          }
                        })
                        .catch(() => {
                          setIsLoading3(false);
                          setModalVisible(true);
                          setModalType('warning');
                          setModalMessage("please retry");
                        })
                        .finally(() => {
                          setIsLoading3(false);
                        });
                    }}

                  >
                    {isLoading3 ? <CircularProgress size={24} color='inherit' /> : 'Start Group'}
                  </Button>
                  <hr style={{ marginBlock: 20 }} />
                  <h4>Note: Once a group is started, you can no longer delete it.</h4>
                  <Button
                    variant="contained"
                    sx={{
                      width: "100%",
                      height: '45px',
                      borderRadius: '16px',
                      backgroundColor: "red",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: '10px',
                      '&:hover': { // Define the hover state here
                        backgroundColor: "#d96b60",
                      },
                    }}
                    onClick={async () => {
                      const confirm = window.confirm("Delete Group?")
                      if (!confirm) {
                        return null
                      }

                      setIsLoading3(true);
                      const user = await localStorage.getItem("user");
                      const parsedUser = JSON.parse(user); // Parse the stored user

                      const userId = parsedUser.user.user_id;
                      const token = parsedUser.user.token;

                      // Format the start date as MM-DD-YYYY
                      const formattedDate = startingDate instanceof Date && !isNaN(startingDate)
                        ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(startingDate)
                        : '';

                      const body = {
                        userid: userId,
                        start_date: formattedDate, // Use formatted date here
                        group_id: groupId,
                      };

                      console.log("BOB", body);

                      // Convert the body object to a JSON string
                      // const bodyString = JSON.stringify(body);

                      HTTPPostWithToken(`${BASEURL}/group/deleteGroup`, body, token)
                        .then(data => {
                          console.log("PES", data);
                          if (data.code === 200) {
                            alert("Group deleted successfully");
                            window.location.href = "/";
                            // setIsLoading3(false);
                            // setModalVisible(true);
                            // setModalType('success');
                            // setModalMessage(data.message);
                            // setTimeout(() => {
                            //   setModalVisible(false);
                            // }, 3000);
                            // fetchGroupData();
                            // fetchGroupTrans();
                            // fetchGroupPayouts();
                          } else {
                            setIsLoading3(false);
                            setModalVisible(true);
                            setModalType('warning');
                            toast(data.errorMessage);
                          }
                        })
                        .catch(() => {
                          setIsLoading3(false);
                          setModalVisible(true);
                          setModalType('warning');
                          setModalMessage("please retry");
                        })
                        .finally(() => {
                          setIsLoading3(false);
                        });
                    }}

                  >
                    {isLoading3 ? <CircularProgress size={24} color='inherit' /> : 'Delete Group'}
                  </Button>
                </>
              )}

              {/* Extra Spacing */}
              <Box sx={{ height: '100px' }} />
            </ScrollBar>
          </Box>
        </Modal>

        {/* history */}

        <Modal
          open={hismodalVisible}
          onClose={() => setHisModalVisibles(null)}
        >
          <Box sx={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxHeight: '90vh', maxWidth: "100vh", margin: '5vh auto', overflowY: 'auto', position: 'relative' }}>
            {/* Header with Close Button */}
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", color: "#000" }} >
                Contribution History
              </Typography>
              <IconButton
                sx={{ backgroundColor: 'red', color: '#fff' }}
                onClick={() => setHisModalVisibles(null)}
              >
                <CloseIcon style={{ color: "#fff" }} />
              </IconButton>
            </Grid>

            {/* Contribution His  tory */}
            <ScrollBar style={{ height: '70vh' }}>
              {groupTrans.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ marginTop: 2, fontSize: 16, color: '#333' }}>
                  No transactions yet
                </Typography>
              ) : (
                groupTrans.map((o, i) => (
                  <Card key={i} sx={{ backgroundColor: o.status === 1 ? "#bef4ce" : o.status === 0 ? "#f4deb2" : "#f4b2b2", padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
                    <CardContent>
                      <Grid container justifyContent="space-between">
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#000" }}>
                            {o.first_name} {o.last_name}

                          </Typography>
                          <Typography variant="caption" sx={{ marginTop: 1 }}>
                            {o.created_at.substring(0, 19)}
                          </Typography>
                        </Box>
                        <Typography variant="body1" color="textPrimary" sx={{ fontWeight: "bold", color: "#000" }}>
                          ₦ {o.amount}
                        </Typography>
                      </Grid>

                      <Typography variant="subtitle2" sx={{ marginTop: 1, fontWeight: 600, color: "#000" }}>Comment</Typography>
                      <Typography variant="body2" sx={{ marginTop: 1, fontWeight: 900 }}>{o.comment}</Typography>

                      {/* Receipt Image */}
                      {o.receipt && (
                        <CardMedia
                          component="img"
                          image={o.receipt}
                          alt="Receipt"
                          sx={{ height: 120, marginY: '10px', borderRadius: '10px' }}
                          onClick={() => window.open(o.receipt)}
                        />
                      )}

                      {/* Approve/Reject Buttons */}
                      {o.status === 0 && groupData.host === auth.user_id && (
                        <Grid container justifyContent="space-between" spacing={2} sx={{ marginTop: 2 }}>
                          <Grid item xs={6}>
                            <Button
                              fullWidth
                              variant="contained"
                              sx={{
                                backgroundColor: "#fff", color: "#000", borderRadius: '12px', '&:hover': { // Define the hover state here
                                  backgroundColor: "#4fb26e",
                                },
                              }}
                              onClick={() => {
                                setDecision(1);
                                setId(o.id);
                                return handleApprovePress();
                              }}
                            >
                              Approve
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              fullWidth
                              variant="contained"
                              sx={{
                                backgroundColor: "red", color: "#fff", borderRadius: '12px', '&:hover': { // Define the hover state here
                                  backgroundColor: "#d96b60",
                                },
                              }}
                              onClick={() => {
                                setDecision(2);
                                setId(o.id);
                                return handleApprovePress();
                              }}
                            >
                              Reject
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
              {/* Spacing at the bottom */}
              <Box sx={{ height: '200px' }} />
            </ScrollBar>
          </Box>
        </Modal>

        {/* payout */}
        <Modal
          open={paymodalVisible}
          onClose={() => setPayModalVisibles(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxHeight: '90vh', maxWidth: "100vh", margin: '5vh auto', overflowY: 'auto', position: 'relative' }}>

            <Box sx={styles.headerContainer}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000" }}>Process Payout</Typography>
              <IconButton onClick={() => setPayModalVisibles(false)}>
                {/* sx={{ backgroundColor: 'red', color: '#fff' }} */}
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ marginTop: 2 }}>
              <Typography sx={styles.label} sx={{ fontWeight: "bold", color: "#000" }}>Amount</Typography>
              <TextField
                fullWidth
                placeholder="Enter amount"
                type="number"
                value={amount}
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
            </Box>

            <Box {...getRootProps()} sx={styles.dropzone}>
              <input {...getInputProps()} />
              <Typography>{isReceiptSelected}</Typography>
              {selectedImage && (
                <img src={selectedImage} alt="Receipt" style={styles.image} />
              )}
            </Box>

            <Box sx={{ marginTop: 2 }}>
              <Typography sx={styles.label} >Processing payout to:</Typography>
              <Typography>
                {
                  userDummy.filter(ex => parseInt(ex.payout_status) > 0).length > 0 ?
                    userDummy.filter(ex => parseInt(ex.payout_status) == 1)[0].first_name :
                    userDummy[0].first_name
                }{" "}{
                  userDummy.filter(ex => parseInt(ex.payout_status) > 0).length > 0 ?
                    userDummy.filter(ex => parseInt(ex.payout_status) == 1)[0].last_name :
                    userDummy[0].last_name
                }
              </Typography>
            </Box>

            <Button
              onClick={handlePayout}
              fullWidth
              variant="contained"
              sx={{
                ...styles.submitButton, '&:hover': { // Define the hover state here
                  backgroundColor: "#d96b60",
                },
              }}
            >
              {isLoading3 ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
        </Modal>

        {/* invite */}
        <Modal
          open={inmodalVisible} // Modal should appear when inmodalVisible is true
          onClose={() => setInModalVisibles(null)}
        >
          <Box sx={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxHeight: '90vh', maxWidth: "100vh", margin: '5vh auto', overflowY: 'auto', position: 'relative' }}>
            {/* Header with Close Button */}
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="h2" style={styles.activeTabText}>
                Invite a Member
              </Typography>
              <IconButton
                sx={{ backgroundColor: 'red', color: '#fff' }}
                onClick={() => setInModalVisibles(null)}
              >
                <CloseIcon style={{ color: "#fff" }} />
              </IconButton>
            </Grid>

            {/* Invite Form */}
            <ScrollBar style={{ height: '70vh' }}>
              <Typography variant="body1" sx={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                Phone Number
              </Typography>

              {/* Phone Number Input */}
              <Box sx={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center', backgroundColor: '#f7f7f7', borderRadius: '12px', paddingLeft: '15px' }}>
                <TextField
                  placeholder="Enter user phone number"
                  type="tel"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setPhone(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    style: { height: '100%' },
                  }}
                />
              </Box>

              {/* Invite Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleInvite}
                sx={{
                  ...styles.submitButton, '&:hover': { // Define the hover state here
                    backgroundColor: "#d96b60",
                  },
                }}
              >
                {isLoading3 ? <CircularProgress size={24} color='inherit' /> : 'Invite'}
              </Button>

              {/* Spacing at the bottom */}
              <Box sx={{ height: '200px' }} />
            </ScrollBar>
          </Box>
        </Modal>


        <Modal
          open={isConfirmModalVisible}
          onClose={() => setConfirmModalVisible(false)}
          aria-labelledby="confirm-decision-modal"
          aria-describedby="confirm-decision-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: 300, md: 400 },
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
            }}
          >
            {/* Title */}
            <Typography id="confirm-decision-modal" variant="h6" sx={{ mb: 2 }}>
              Confirm Decision
            </Typography>

            {/* Message */}
            <Typography id="confirm-decision-description" sx={{ mb: 4 }}>
              Are you sure you want to {decision === 1 ? "approve" : "reject"} this payment?
            </Typography>

            {/* Action Buttons */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#4caf50", color: "#fff", '&:hover': { // Define the hover state here
                      backgroundColor: "#d96b60",
                    },
                  }}
                  onClick={handleConfirm}
                >
                  Yes
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "red", color: "#fff", '&:hover': { // Define the hover state here
                      backgroundColor: "#d96b60",
                    },
                  }}
                  onClick={handleCancel}
                >
                  No
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>

      </Box>

    </Modal>
  );
};

export default GroupDetailsModal;
const styles = {
  modalContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 4,
    borderRadius: 2,
    width: "80%",
    maxWidth: 500,
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    color: "#000"
  },
  textField: {
    backgroundColor: "#f7f7f7",
    borderRadius: 1,
  },
  dropzone: {
    border: "2px dashed #ccc",
    padding: 2,
    marginTop: 2,
    textAlign: "center",
    cursor: "pointer",
    borderRadius: 2,
  },
  image: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    marginTop: 2,
  },
  submitButton: {
    marginTop: 4,
    backgroundColor: "#4fb26e"
  },
};