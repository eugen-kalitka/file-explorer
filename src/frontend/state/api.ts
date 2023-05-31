import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { FileArray } from 'chonky';
import type {Node} from '../../common/types/Node';
import {FolderEvent} from "../../common/types/FolderEvent";

let socket = null;

const formatNode = (node) => ({
  id: node.path,
  name: node.name,
  isDir: node.type === 'folder',
  size: node.size,
  modDate: node.modifiedAt,
  isHidden: node.name.startsWith('.')
})

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api'
  }),

  endpoints: (build) => ({
    removeNodes: build.mutation<>({
      queryFn: (nodes) => {
        if (!socket) {
          return;
        }
        const removeNodesEvent = {
          type: 'unlink',
          files: nodes.map(node => node.id)
        };
        socket.send(JSON.stringify(removeNodesEvent));
        return Promise.resolve([]);
      }
    }),

    moveNodes: build.mutation({
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

    streamFolders: build.query<FileArray, string>({
      query: (path) => ({url: `directories?path=${path}`}),

      keepUnusedDataFor: 0,

      transformResponse: (response: Node[], meta) => {
        if (!response?.children) {
          return {
            data: []
          };
        }
        return response.children.filter(Boolean).map(childItem => formatNode(childItem));
      },

      // queryFn: () => ({ data: [] }),

      async onCacheEntryAdded(arg, {updateCachedData, cacheDataLoaded, cacheEntryRemoved}) {
        console.log('........ON CACHE ENTRY ADDED');
        await cacheDataLoaded;

        const ws = new WebSocket('ws://localhost:5000/ws');

        // populate the array with messages as they are received from the websocket
        ws.addEventListener('message', (event) => {
          console.log('......EVENT.....', event);
          updateCachedData((draft) => {
            const parsedData = JSON.parse(event.data);
            if (parsedData.type === 'unlink') {
              const index = draft.findIndex(({name}) => name === parsedData.name);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            }
            if (parsedData.type === 'add') {
              draft.push(formatNode(parsedData.data));
            }
            if (parsedData.type === 'change') {
              const index = draft.findIndex(({name}) => name === parsedData.data.name);
              if (index !== -1) {
                draft[index] = formatNode(parsedData.data);
              }
            }
          })
        });
        ws.addEventListener('open', () => {

          socket = ws;

          const openFolderEvent: FolderEvent = {
            type: 'open',
            path: arg
          };
          ws.send(JSON.stringify(openFolderEvent));
        });
        await cacheEntryRemoved;
        ws.close()
      },

    }),
  }),
})

export const { useStreamFoldersQuery, useRemoveNodesMutation, useMoveNodesMutation } = api;
export default api;
