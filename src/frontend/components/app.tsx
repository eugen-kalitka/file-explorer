import React from 'react';
import FileExplorer from './file-explorer';
import usePathQueryParam from "../hooks/usePathQueryParam";

const App = () => {
  const {path, updateUrl} = usePathQueryParam();

  return (<div style={{height: '100vh'}}>
    <FileExplorer key={path} path={path} updateUrl={updateUrl} />
  </div>);

}
export default App;
