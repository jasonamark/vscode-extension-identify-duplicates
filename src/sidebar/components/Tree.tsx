import React from "react";
import { IDuplicateGroup, IDuplicateGroupsByType } from "../types";
import { TreeNode } from "./TreeNode";
import "./styles.css";

export interface ITreeProps {
  duplicateGroupsByType: IDuplicateGroupsByType;
}

export function Tree({ duplicateGroupsByType }: ITreeProps) {
  return (
    <div className="tree">
      {Object.entries(duplicateGroupsByType).map(
        ([key, groups]: [key: string, groups: IDuplicateGroup[]]) => (
          <TreeNode key={key} isRoot={true} name={key} node={groups} />
        ),
      )}
    </div>
  );
}

export default Tree;
