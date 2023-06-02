import type { SocketStream } from '@fastify/websocket';
import type { FSWatcher } from 'chokidar';

class SubscriptionsHandler {
  subscriptionsByPath: Map<string, SocketStream[]>
  watchersByPath: Map<string, FSWatcher>

  constructor() {
    this.subscriptionsByPath = new Map();
    this.watchersByPath = new Map();
  }

  getSubscriptionsByPath(path) {
    return this.subscriptionsByPath.get(path);
  }

  getWatcherByPath(path) {
    return this.watchersByPath.get(path);
  }

  subscribe(path, connection) {
    const existingPathSubscriptions = this.subscriptionsByPath.get(path);
    this.subscriptionsByPath.set(path, existingPathSubscriptions ? existingPathSubscriptions.concat([connection]) : [connection]);
  }

  setWatcher(path, watcher) {
    this.watchersByPath.set(path, watcher);
  }

  async unsubscribe(connection) {
    const subscriptionKeys = this.subscriptionsByPath.keys();
    for (const subscriptionKey of subscriptionKeys) {
      const subscription = this.subscriptionsByPath.get(subscriptionKey);
      if (subscription && subscription.find(subscribedConnection => subscribedConnection === connection)) {
        this.subscriptionsByPath.set(subscriptionKey, subscription.filter(subscribedConnection => subscribedConnection !== connection))

        /**
         * If no open connections left - close file watcher
         * */
        if (this.subscriptionsByPath.get(subscriptionKey).length === 0) {
          const watcher = this.watchersByPath.get(subscriptionKey);
          if (watcher && watcher.close) {
            await watcher.close();
            this.watchersByPath.delete(subscriptionKey);
          }
        }
      }
    }
  }
}

export default SubscriptionsHandler;
