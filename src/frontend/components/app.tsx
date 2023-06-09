import React from 'react';
import Layout from './layout';
import { Box } from '@material-ui/core';
import FileExplorer from './file-explorer';
import { Container as ModalPromiseContainer } from 'react-modal-promise'
import usePathQueryParam from "../hooks/usePathQueryParam";
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const App = () => {
  const {path, updateUrl} = usePathQueryParam();

  return (
    <Layout>
      <FileExplorer key={path} path={path} updateUrl={updateUrl} />
    </Layout>
  );
}
export default App;
