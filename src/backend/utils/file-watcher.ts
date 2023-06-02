import chokidar from 'chokidar';
import SubscriptionsHandler from "./subscriptions-handler";
import path from "path";
import {serializeMessage} from "./helpers";
import {fileActionTypes} from "../../common/constants/file-action-types";
import directoryTreeBuilder from "./directory-tree-builder";

class FileWatcher {
  subscriptions: SubscriptionsHandler;

  constructor() {
    this.subscriptions = new SubscriptionsHandler();
  }

  start(directoryName, connection) {
    const fullDirPath = path.resolve(process.cwd(), 'directory', directoryName);

    this.subscriptions.subscribe(directoryName, connection);

    if (!this.subscriptions.getWatcherByPath(directoryName)) {
      const watcher = this.watch(fullDirPath, directoryName);
      this.subscriptions.setWatcher(directoryName, watcher);
    }

    const tree = directoryTreeBuilder(directoryName);
    connection.socket.send(serializeMessage(fileActionTypes.OPEN, tree));
  }

  watch(fullDirectoryPath, directoryName) {
    return chokidar.watch(fullDirectoryPath, {
      ignoreInitial: true,
      depth: 0
    })
      .on('add', (filePath, stats) => {
        console.log(`FileWatcher:: File ${filePath} has been added`);
        this.onNodeAdded(directoryName, filePath);
      })
      .on('addDir', (dirPath, stats) => {
        console.log(`FileWatcher:: Directory ${dirPath} has been added`);
        this.onNodeAdded(directoryName, dirPath);
      })
      .on('change', (filePath, stats) => {
        console.log(`FileWatcher:: File ${filePath} has been changed`);
        this.onNodeChanged(fullDirectoryPath, directoryName, filePath);
      })
      .on('unlink', filePath => {
        console.log(`FileWatcher:: File ${filePath} has been removed`);
        this.onNodeRemoved(directoryName, filePath);
      })
      .on('unlinkDir', dirPath => {
        console.log(`FileWatcher:: Directory ${dirPath} has been removed`);
        this.onNodeRemoved(directoryName, dirPath);
      });

    /**
     * fs.watch API is missing next items
     * 1. on Mac - file removal via finder triggers rename event
     *
     * */
    // fs.watch(directoryPath, { recursive: true }, (event, filename) => {
    //     console.log('......EVENT', event);
    //     console.log('......FILENAME', filename);
    // });
  }

  stop(connection) {
    this.subscriptions.unsubscribe(connection);
  }

  broadcast(directoryName, message) {
    this.subscriptions.getSubscriptionsByPath(directoryName).forEach(({socket}) => {
      socket.send(message);
    });
  }

  onNodeAdded(directoryName, nodePath) {
    const targetNodePath = nodePath.replace(path.join(process.cwd(), 'directory') + path.sep, '');

    const message = serializeMessage(fileActionTypes.ADD, directoryTreeBuilder(targetNodePath));
    this.broadcast(directoryName, message);
  }

  onNodeChanged (fullDirectoryPath, directoryName, nodePath) {
    const fileName = path.parse(nodePath).base;
    const targetNodePath = path.join(directoryName, fileName);

    const message = serializeMessage(fileActionTypes.CHANGE, directoryTreeBuilder(targetNodePath))
    this.broadcast(directoryName, message);
  }

  onNodeRemoved(directoryName, nodePath) {
    const message = serializeMessage(fileActionTypes.UNLINK, {
      name: path.parse(nodePath).base
    });
    this.broadcast(directoryName, message);
  }

}

export default FileWatcher;
