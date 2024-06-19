import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

const HandleDeleteModal = ({ open, handleClose, onSuccess, isDeleting, deleteMessage = 'Are you sure you want to delete this?' }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "35%" },
          maxHeight: "70%",
          overflowY: "auto",
          bgcolor: "#fff",
          boxShadow: 24,
          px: 4,
          py: 2,
          borderRadius: 2,
          outline: "none",
        }}
      >
        <Typography sx={{ fontWeight: '700', fontSize: '24px' }}>{deleteMessage}</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'end' }}>
            <Button color="primary" variant="outlined" onClick={handleClose}>No</Button>
            <Button color="error" variant="contained" onClick={onSuccess} disabled={isDeleting}>Yes</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default HandleDeleteModal;
