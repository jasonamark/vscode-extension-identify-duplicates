export interface ITreeObject {
  filePath: string;
  line: number;
  character: number;
  objectType: string;
  name: string;
}

export interface IDuplicateGroup {
  duplicates: ITreeObject[];
}

export interface IDuplicateGroupsByType {
  css: IDuplicateGroup[];
  enum: IDuplicateGroup[];
  interface: IDuplicateGroup[];
  method: IDuplicateGroup[];
}
