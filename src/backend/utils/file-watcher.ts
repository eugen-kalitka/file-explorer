import chokidar from 'chokidar';

function fileWatcher(directoryName, callbacks) {
  chokidar.watch(directoryName, {
    ignoreInitial: true,
    depth: 0
  })
    .on('add', (filePath, stats) => {
      console.log(`File ${filePath} has been added`);
      callbacks.onNodeAdded(filePath);
    })
    .on('addDir', (dirPath, stats) => {
      console.log(`Directory ${dirPath} has been added`);
      callbacks.onNodeAdded(dirPath);
    })
    .on('change', (filePath, stats) => {
      console.log(`File ${filePath} has been changed`);
      callbacks.onNodeChanged(filePath);
    })
    .on('unlink', filePath => {
      console.log(`File ${filePath} has been removed`);
      callbacks.onNodeRemoved(filePath);
    })
    .on('unlinkDir', dirPath => {
      console.log(`Directory ${dirPath} has been removed`);
      callbacks.onNodeRemoved(dirPath);
    });
}

export default fileWatcher;
