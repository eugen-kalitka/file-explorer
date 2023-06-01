export const getFolderChain = (path) => {
  let latestPath = [];
  const pathParts = path.split('/').filter(Boolean);
  if (!pathParts.length) {
    return [{
      isDir: true,
      id: '/',
      name: 'root'
    }];
  }
  return pathParts.reduce((folderChain, currentFolder) => {
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
