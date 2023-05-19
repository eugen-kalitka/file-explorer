import fs from 'fs';
import path from 'path';
import type {Node} from '../../common/types/Node';
import crypto from 'crypto';

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
    // id: crypto.createHash('md5').update(filename).digest("hex"),
    children: null,
    modifiedAt: stats.mtime.toISOString()
  };

  if (stats.isDirectory()) {
    info.type = 'folder';
    // info.children = fs.readdirSync(filename).map((child) => directoryTreeBuilder(filename + '/' + child));

    // info.children = fs.readdirSync(targetFilePath).map(child => (filename && filename !== '/') ? `${filename}/${child}` : child);

    if (!isChild) {
      info.children = fs.readdirSync(targetFilePath).map(child => {
        const childName = (filename && filename !== '/') ? `${filename}/${child}` : child;
        return directoryTreeBuilder(childName, true);
      });
    }
  } else {
    info.type = 'file';
    info.size = stats.size;
  }
  return info;
}

export default directoryTreeBuilder;
