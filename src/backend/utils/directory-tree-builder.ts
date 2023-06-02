import fs from 'fs';
import path from 'path';
import type {Node} from '../../common/types/Node';
import {nodeTypes} from "../../common/constants/node-types";

function directoryTreeBuilder(filename, isChild = false) {
  const targetFilePath = path.join(process.cwd(), 'directory', filename);
  let stats: any = {};
  try {
    stats = fs.lstatSync(targetFilePath);
  } catch (e) {
    return null;
  }

  const info: Node = {
    path: filename,
    name: path.basename(filename),
    type: null,
    children: null,
    modifiedAt: stats.mtime.toISOString()
  };

  if (stats.isDirectory()) {
    info.type = nodeTypes.FOLDER;
    if (!isChild) {
      info.children = fs.readdirSync(targetFilePath).map(child => {
        const childName = (filename && filename !== '/') ? `${filename}/${child}` : child;
        return directoryTreeBuilder(childName, true);
      });
    }
  } else {
    info.type = nodeTypes.FILE;
    info.size = stats.size;
  }
  return info;
}

export default directoryTreeBuilder;
