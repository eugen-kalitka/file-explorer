export const getFolderChain = (path) => {
  let latestPath = [];
  return path.split('/').reduce((folderChain, currentFolder) => {
    latestPath.push(currentFolder);
    folderChain.push({
      isDir: true,
      id: latestPath.join('/'),
      name: currentFolder
    });
    return folderChain;
  }, [{
    isDir: true,
    id: '/',
    name: 'root'
  }]);
};
