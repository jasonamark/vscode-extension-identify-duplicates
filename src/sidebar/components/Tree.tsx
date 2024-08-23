import React from 'react';
import { IDuplicateGroup, IDuplicateGroupsByType } from "../types";
import { TreeNode } from "./TreeNode";

export interface ITreeProps {
	duplicateGroupsByType: IDuplicateGroupsByType
}

export function Tree({ duplicateGroupsByType }: ITreeProps) {
  return (
    <div>
      {Object.entries(duplicateGroupsByType).map(([key, groups]: [key: string, groups: IDuplicateGroup[]]) => (
        <TreeNode
					key={key}
					node={groups}
					objectGroup={key}
					isFolder={true}
				/>
      ))}
    </div>
  );
};

export default Tree;