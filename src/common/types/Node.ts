export interface Node {
  path: string;
  name: string;
  type: 'folder' | 'file' | null;
  // id: string;
  children: Node[] | null;
  // children: string[] | null;
  size?: number;
  modifiedAt?: string;
}
