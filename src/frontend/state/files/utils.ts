import type {FileData} from "chonky";
import type {Node} from "../../../common/types/Node";
import {nodeTypes} from "../../../common/constants/node-types";

export const parseWsMessage = (data) => {
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    console.log(`Error occurred on parsing incoming message`, e);
    return {};
  }
  return parsedData;
}

/**
 * Transforms node object to Chonky FileData
 * */
export const formatNode = (node: Node): FileData => ({
  id: node.path,
  name: node.name,
  isDir: node.type === nodeTypes.FOLDER,
  size: node.size,
  modDate: node.modifiedAt,
  isHidden: node.name?.startsWith('.') || false
});

export const transformResponse = (response: Node) => {
  if (!response?.children) {
    return {
      data: []
    };
  }
  return response.children.filter(Boolean).map(childItem => formatNode(childItem));
};
