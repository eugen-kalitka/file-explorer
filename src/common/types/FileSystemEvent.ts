import type {Node} from './Node';

export type EventType = 'add' | 'change';

export interface FileSystemAddOrChangeEvent {
  type: EventType,
  data: Node;
}
