import api from '../api';
import {FileArray, FileData} from "chonky";
import {FolderEvent} from "../../../common/types/FolderEvent";
import {fileActionTypes} from "../../../common/constants/file-action-types";
import { formatNode, transformResponse, parseWsMessage } from './utils'
import errorHandler from './error-handler';

let socket = null;

const filesApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Mutation endpoints
     * */
    removeNodes: build.mutation<any[], FileArray>({
      queryFn: (nodes) => {
        if (!socket) {
          return;
        }
        const removeNodesEvent = {
          type: fileActionTypes.UNLINK,
          files: nodes.map(node => node)
        };
        socket.send(JSON.stringify(removeNodesEvent));
        return Promise.resolve({ data: [] });
      }
    }),

    moveNodes: build.mutation<any[], { nodes: FileArray; destination: FileData }>({
      queryFn: ({ nodes, destination }) => {
        if (!socket) {
          return;
        }
        const moveNodesEvent = {
          type: 'move',
          files: nodes.map(node => node.id),
          destination: destination.id
        };
        socket.send(JSON.stringify(moveNodesEvent));
        return Promise.resolve([]);
      }
    }),

    createFolder: build.mutation<any[], { folderName: string; path: string; }>({
      queryFn: ({ folderName, path }) => {
        if (!socket) {
          return;
        }
        const createFolderEvent = {
          type: fileActionTypes.CREATE_FOLDER,
          folderName,
          path
        };
        socket.send(JSON.stringify(createFolderEvent));
        return Promise.resolve([]);
      }
    }),

    /**
     * Query endpoints
     * */
    streamFolders: build.query<FileArray, string>({
      keepUnusedDataFor: 0,
      queryFn() {
        return { data: [] };
      },

      async onCacheEntryAdded(path, {updateCachedData, cacheDataLoaded, cacheEntryRemoved}) {
        await cacheDataLoaded;

        const ws = new WebSocket('ws://localhost:5000/ws');

        // populate the array with messages as they are received from the websocket
        ws.addEventListener('message', (event) => {
          const parsedData = parseWsMessage(event.data);

          if (parsedData.type === 'error' || parsedData.error) {
            return errorHandler(parsedData.error);
          }
          if (!parsedData.data) {
            console.warn('WS Package with empty data has arrived', parsedData);
            return;
          }

          if (parsedData.type === fileActionTypes.OPEN) {
            updateCachedData((draft) => {
              draft.push(...transformResponse(parsedData.data));
            })
          }

          if (parsedData.type === fileActionTypes.UNLINK) {
            updateCachedData((draft) => {
              const index = draft.findIndex(({name}) => name === parsedData.data.name);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            });
          }

          if (parsedData.type === fileActionTypes.ADD) {
            updateCachedData((draft) => {
              draft.push(formatNode(parsedData.data));
            });
          }

          if (parsedData.type === fileActionTypes.CHANGE) {
            updateCachedData((draft) => {
              const index = draft.findIndex(({name}) => name === parsedData.data.name);
              if (index !== -1) {
                draft[index] = formatNode(parsedData.data);
              }
            });
          }
        });

        ws.addEventListener('open', () => {
          socket = ws;
          const openFolderEvent: FolderEvent = {
            type: fileActionTypes.OPEN,
            path
          };
          ws.send(JSON.stringify(openFolderEvent));
        });
        await cacheEntryRemoved;
        ws.close()
      },

    }),
  })
});

export default filesApi;
