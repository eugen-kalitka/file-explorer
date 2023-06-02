import React from 'react';
import { Box } from '@material-ui/core';
import { Container as ModalPromiseContainer } from 'react-modal-promise'
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{
        p: 2,
        height: '100vh',
        bgcolor: '#424242',
      }}>
        {children}
        <ModalPromiseContainer />
        <ToastContainer autoClose={5000} />
      </Box>
    </ThemeProvider>
  );

}
export default Layout;
