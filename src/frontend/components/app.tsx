import React from 'react';
import FileExplorer from './file-explorer';
import { Container as ModalPromiseContainer } from 'react-modal-promise'
import usePathQueryParam from "../hooks/usePathQueryParam";
import { ToastContainer } from 'react-toastify';

const App = () => {
  const {path, updateUrl} = usePathQueryParam();

  return (<div style={{height: '100vh'}}>
    <FileExplorer key={path} path={path} updateUrl={updateUrl} />
    <ModalPromiseContainer />
    <ToastContainer autoClose={5000} />
  </div>);

}
export default App;
