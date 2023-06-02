import { nodeTypes } from "../constants/node-types";

export interface Node {
  path: string;
  name: string;
  type: nodeTypes | null;
  children: Node[] | null;
  size?: number;
  modifiedAt?: string;
}
