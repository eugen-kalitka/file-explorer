import type { SocketStream } from '@fastify/websocket';
import FileWatcher from '../utils/file-watcher';
import FileActions from '../utils/file-actions';
import { fileActionTypes } from "../../common/constants/file-action-types";

async function service(fastify) {
  const fileWatcher = new FileWatcher();

  fastify.get('/ws', {websocket: true}, async (connection: SocketStream) => {

    connection.socket.on('message', (data) => {
      let message;
      try {
        message = JSON.parse(data.toString());
      } catch(e) {
        console.log('Error occurred on parsing message');
        return;
      }
      if (message.type === 'open') {
        const directoryToWatch = message.path === '/' ? '' : message.path;
        fileWatcher.start(directoryToWatch, connection)
      }
      if (message.type === fileActionTypes.UNLINK) {
        FileActions.unlink(message.files);
      }
      if (message.type === fileActionTypes.MOVE) {
        FileActions.move(message.files, message.destination);
      }
      if (message.type === fileActionTypes.CREATE_FOLDER) {
        FileActions.createFolder(message.path, message.folderName);
      }
    });

    connection.socket.on('close', (e) => {
      fileWatcher.stop(connection);
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
