export interface FolderEvent {
  type: 'open' | 'close',
  path?: string;
}
