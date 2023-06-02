import React from 'react';
import {
  FileBrowser,
  FileNavbar,
  FileToolbar,
  ChonkyActions,
  FileList,
  FileHelper
} from 'chonky';
import { useStreamFoldersQuery, useRemoveNodesMutation, useMoveNodesMutation, useCreateFolderMutation } from '../../state/files';
import { getFolderChain } from './file-explorer.utils';
import prompt from '../prompt';

const FileExplorer = ({ path, updateUrl }) => {
  const folderChain = getFolderChain(path);

  const {data = [], ...rest} = useStreamFoldersQuery(path);

  const [removeNodes] = useRemoveNodesMutation();
  const [moveNodes] = useMoveNodesMutation();
  const [createFolder] = useCreateFolderMutation();

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
    if (data.id === ChonkyActions.CreateFolder.id) {
      prompt().then((value) => {
        createFolder({
          folderName: value,
          path
        });
      });
      return;
    }
  }

  const fileActions = [
    ChonkyActions.CreateFolder,
    ChonkyActions.DeleteFiles,
  ];

  return (
    <FileBrowser files={data} fileActions={fileActions} folderChain={folderChain} onFileAction={handleFileAction} darkMode>
      <FileNavbar/>
      <FileToolbar/>
      <FileList/>
    </FileBrowser>
  );
};

export default FileExplorer;
