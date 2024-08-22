import React from 'react';
import { IDuplicateGroup, IDuplicateGroupsByType, ITreeObject } from "../types";
import { TreeNode } from "./TreeNode";

export interface ITreeProps {
	duplicateGroupsByType: IDuplicateGroupsByType
}

export function Tree({ duplicateGroupsByType }: ITreeProps) {
  return (
    <div>
      {Object.entries(duplicateGroupsByType).map(([key, groups]) => (
        <TreeNode
					key={key}
					node={{ duplicates: groups }}
					objectType={key}
					isRoot={true}
				/>
      ))}
    </div>
  );
};

export default Tree;