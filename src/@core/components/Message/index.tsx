import React from 'react';
import { Modal, Box, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import WarningIcon from '@mui/icons-material/WarningAmberOutlined';

interface MessageModalProps {
  isVisible: boolean;
  type: 'success' | 'warning';
  message: string;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ isVisible, type, message, onClose }) => {
  return (
    <Modal open={isVisible} onClose={onClose} closeAfterTransition>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: 'center',
              borderColor: type === 'success' ? 'green' : 'orange',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          >
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                height: 100,
                mx: 'auto',
              }}
            >
              {type === 'success' ? (
                <CheckIcon sx={{ fontSize: 80, color: 'green' }} />
              ) : (
                <WarningIcon sx={{ fontSize: 80, color: 'orange' }} />
              )}
            </Box>
            <Typography variant="h6" gutterBottom>
              {message}
            </Typography>
            <Button variant="contained" color={type === 'success' ? 'primary' : 'warning'} onClick={onClose}>
              Close
            </Button>
          </Paper>
        </motion.div>
      </Box>
    </Modal>
  );
};

export default MessageModal;
