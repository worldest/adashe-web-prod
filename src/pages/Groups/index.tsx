//@ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  Grid,
  TextField,
  Drawer,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import Image from 'next/image';
import { HTTPGetWithToken, HTTPPostWithToken } from 'src/Services';
import { BASEURL } from 'src/Constant/Link';
import GroupDetailsModal from 'src/@core/components/Modal';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Modal.setAppElement('#yourAppElement');


const PaymentRequest: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [group, setGroup] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleGroupPress = async (groupId) => {
    toast('Sending Request...');

    const user = await localStorage.getItem("user");

    if (user === null) {
      // Handle navigation if user is null
      return;
    }

    const parsedUser = JSON.parse(user);
    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;
    const payload = {};
    HTTPPostWithToken(
      `${BASEURL}/group/member/request/${userId}/${groupId}`,
      payload,
      token
    )
      .then((data) => {
        toast(data.code === 200 ? data.message : data.errorMessage);
        closeModal()
      })
      .catch(() => toast('An error occurred, please try again.'));
  };


  const getGroup = async (query = '') => {
    setIsLoading(true);
    const user = await localStorage.getItem("user");

    if (user === null) {
      // Handle navigation if user is null
      return;
    }

    const parsedUser = JSON.parse(user);
    const userId = parsedUser.user.user_id;
    const token = parsedUser.user.token;
    HTTPGetWithToken(
      `${BASEURL}/group/member/all/${userId}?page=${page}&query=${query}`,
      token
    )
      .then((data) => {
        console.log("", data)
        if (data.code === 200) {
          setGroup((prev) => [
            ...prev,
            ...data.payload.map((item) => ({
              ...item,
              start_date: item.start_date ? formatDate(item.start_date) : null,
            })),
          ]);
        }
      })
      .catch(() => toast('Error fetching groups.'))
      .finally(() => setIsLoading(false));
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    getGroup(searchQuery);
  };

  useEffect(() => {
    getGroup();
  }, []);

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [currentID, setCurrentID] = useState("")

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }


  return (
    <Box sx={{ padding: 5, backgroundColor: "#fff" }}>
      <Toaster />
      <Grid container spacing={2} sx={{ paddingX: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#000", fontWeight: "bold" }}>
          Groups
        </Typography>
      </Grid>


      {/* Search Input */}
      <Box p={2}>
        <TextField
          placeholder="Search for group"
          fullWidth
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              setPage(1);
              setGroup([]);
              getGroup(e.target.value);
            }
          }}
        />
      </Box>

      {/* Group List */}
      <Box p={2}>
        {isLoading && group.length === 0 ? (
          <Box textAlign="center" mt={3}>
            <span style={{ color: '#4fb26e', fontSize: '16px' }}>Loading.....</span>
          </Box>
        ) : (
          <List>
            {group.map((item) => (
              <ListItem
                key={item.id}
                button
                onClick={() => {
                  setCurrentID(item.id);
                  openModal();
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleGroupPress(item.id);
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <Image
                      src="/images/user_10968773.png" // Replace with your actual image path
                      alt="Group Icon"
                      width={40}
                      height={40}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.group_name}
                  secondary={item.created_at.replace('T', ' ').replace('000Z', '')}
                />
                <Typography variant="body2">₦{item.amount} ({item.payment_interval})</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        id="yourAppElement"
        contentLabel="Example Modal"
      >
        <a onClick={closeModal} style={{ textDecoration: "none", justifyContent: "flex-end", alignItems: "flex-end", float: "right" }} href="#close"><span className='fa fa-times' style={{ fontSize: 20 }}>X</span></a>
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Confirm</h2>

        <div style={{ fontSize: 15, fontWeight: "700" }}>Are you sure you want to join group?</div>
        <Button onClick={() => {
          handleGroupPress(currentID);
        }} style={{ marginTop: 10, border: "1px solid" }}>Yes, proceed</Button>

      </Modal>
      {/* Load More Button */}
      {group.length > 0 && (
        <Box textAlign="center" mt={2}>
          <Button style={{ backgroundColor: "#4fb26e" }} onClick={handleLoadMore} variant="contained">
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PaymentRequest;
