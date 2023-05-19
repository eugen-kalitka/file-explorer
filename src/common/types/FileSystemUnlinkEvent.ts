export interface FileSystemUnlinkEvent {
  type: 'unlink',
  data: {
    id: string;
    path: string;
  }
}
