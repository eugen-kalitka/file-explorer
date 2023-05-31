import fs from 'fs';
import path from 'path';
import directoryTreeBuilder from '../utils/directory-tree-builder';
import fileWatcher from '../utils/file-watcher';

const listenDirectory = (directoryName, socket) => {
  console.log("PATH TO WATCH: ", directoryName);
  const formatPath = (nodePath) => {
    nodePath = nodePath.replace(directoryName + path.sep, '');
    return nodePath.split(path.sep)[0];
  };

  const onNodeRemoved = (nodePath) => {
    socket.send(JSON.stringify({
      type: 'unlink',
      name: formatPath(nodePath)
    }));
  };

  const onNodeAdded = (nodePath) => {
    const targetNodePath = nodePath.replace(path.join(process.cwd(), 'directory') + path.sep, '');
    socket.send(JSON.stringify({
      type: 'add',
      data: directoryTreeBuilder(targetNodePath)
    }));
  };

  const onNodeChanged = (nodePath) => {
    const targetNodePath = nodePath.replace(directoryName + path.sep, '');
    socket.send(JSON.stringify({
      type: 'change',
      data: directoryTreeBuilder(targetNodePath)
    }));
  }

  return fileWatcher(directoryName, {
    onNodeAdded,
    onNodeChanged,
    onNodeRemoved
  });
}

async function service(fastify) {
  const subscriptions = new WeakMap();

  fastify.get('/ws', {websocket: true}, async (connection, request) => {
    connection.socket.on('message', (data) => {
      const parsed = JSON.parse(data.toString());
      console.log(" >>>>>>> data", parsed);
      if (parsed.type === 'open') {
        const directoryToWatch = parsed.path === '/' ? '' : parsed.path;
        const watcher = listenDirectory(path.resolve(process.cwd(), 'directory', directoryToWatch), connection.socket);
        subscriptions.set(connection, watcher);
      }
      if (parsed.type === 'unlink') {
        parsed.files.forEach(node => {
          const fullNodePath = path.join(process.cwd(), 'directory', node);
          if (fs.existsSync(fullNodePath)) {
            fs.unlinkSync(fullNodePath)
          }
        })
      }
      if (parsed.type === 'move') {
        const destinationPath = path.join(process.cwd(), 'directory', parsed.destination);
        parsed.files.forEach(node => {
          const fullNodePath = path.join(process.cwd(), 'directory', node);
          const nodeDestinationPath = path.join(destinationPath, path.basename(fullNodePath));
          if (fs.existsSync(fullNodePath)) {
            fs.renameSync(fullNodePath, nodeDestinationPath);
          }
        })
      }
    });

    connection.socket.on('close', (e) => {
      const subscription = subscriptions.get(connection);
      if (subscription) {
        subscription.close();
      }
    });

    /**
     * fs.watch API is missing next items
     * 1. on Mac - file removal via finder triggers rename event
     *
     * TODO check more missing items in fs.watch API
     * */
    // fs.watch(directoryPath, { recursive: true }, (event, filename) => {
    //     console.log('......EVENT', event);
    //     console.log('......FILENAME', filename);
    // });
  })
}

export default service;
