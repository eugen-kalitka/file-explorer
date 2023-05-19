import React from 'react';
import {
  FileBrowser,
  FileNavbar,
  FileToolbar,
  ChonkyActions,
  FileList,
  FileHelper
} from 'chonky';
import {useStreamFoldersQuery, useRemoveNodesMutation, useMoveNodesMutation} from '../../state/api';
import usePathQueryParam from '../../hooks/usePathQueryParam';
import {getFolderChain} from './file-explorer.utils';

const FileExplorer = () => {
  const {path, updateUrl} = usePathQueryParam();

  const folderChain = getFolderChain(path);

  const {data, ...rest} = useStreamFoldersQuery(path);

  const [removeNodes] = useRemoveNodesMutation();
  const [moveNodes] = useMoveNodesMutation();

  console.log(">>>>>>>>> data");
  console.log(data);

  const handleFileAction = (data) => {
    if (data.id === ChonkyActions.OpenFiles.id) {
      const {targetFile, files} = data.payload;
      const fileToOpen = targetFile ?? files[0];
      if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
        updateUrl(fileToOpen.id);
        return;
      }
    }
    if (data.id === ChonkyActions.DeleteFiles.id) {
      removeNodes(data.state.selectedFiles);
      return;
    }
    if (data.id === ChonkyActions.MoveFiles.id) {
      moveNodes({
        nodes: data.payload.files,
        destination: data.payload.destination
      });
      return;
    }
  }

  const fileActions = [
    ChonkyActions.DeleteFiles,
  ];

  return (
    <FileBrowser files={data} fileActions={fileActions} folderChain={folderChain} onFileAction={handleFileAction}>
      <FileNavbar/>
      <FileToolbar/>
      <FileList/>
    </FileBrowser>
  );
};

export default FileExplorer;
