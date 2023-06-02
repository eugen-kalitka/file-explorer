import type { SocketStream } from '@fastify/websocket';
import FileWatcher from '../utils/file-watcher';
import FileActions from '../utils/file-actions';
import { fileActionTypes } from "../../common/constants/file-action-types";
import {serializeMessage} from "../utils/helpers";
import parseWsMessage from "../../common/utils/ws-message-parser";

async function service(fastify) {
  const fileWatcher = new FileWatcher();

  fastify.get('/ws', {websocket: true}, async (connection: SocketStream) => {

    connection.socket.on('message', async (data) => {
      const message = parseWsMessage(data.toString());

      if (message.type === 'open') {
        const directoryToWatch = message.path === '/' ? '' : message.path;
        fileWatcher.start(directoryToWatch, connection)
      }

      /**
       * Remove files/folders handler
       * */
      if (message.type === fileActionTypes.UNLINK) {
        try {
          await FileActions.unlink(message.files);
        } catch (e) {
          connection.socket.send(serializeMessage('error', null, e.message));
        }
      }

      /**
       * Move files/folders handler
       * */
      if (message.type === fileActionTypes.MOVE) {
        try {
          await FileActions.move(message.files, message.destination);
        } catch (e) {
          connection.socket.send(serializeMessage('error', null, e.message));
        }
      }

      /**
       * Create Folder handler
       * */
      if (message.type === fileActionTypes.CREATE_FOLDER) {
        try {
          await FileActions.createFolder(message.path, message.folderName);
        } catch (e) {
          connection.socket.send(serializeMessage('error', null, e.message));
        }
      }
    });

    connection.socket.on('close', (e) => {
      fileWatcher.stop(connection);
    });
  })
}

export default service;
