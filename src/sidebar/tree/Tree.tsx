import React from "react";
import { IDuplicateGroup, IDuplicateGroupsByType } from "../types";
import { TreeNode } from "./TreeNode";
import "./styles.css";
import * as l10n from '@vscode/l10n'

export interface ITreeProps {
  duplicateGroupsByType: IDuplicateGroupsByType;
}

export function Tree({ duplicateGroupsByType }: ITreeProps) {
  const hasNoDuplicates = (): boolean => {
    return (
      duplicateGroupsByType.css.length === 0 &&
      duplicateGroupsByType.enum.length === 0 &&
      duplicateGroupsByType.interface.length === 0 &&
      duplicateGroupsByType.method.length === 0
    );
  };

  return (
    <>
      {hasNoDuplicates() && (
        <div className="no-duplicates">{l10n.t("No Duplicates Found")}</div>
      )}
      {!hasNoDuplicates() && (
        <div className="tree">
          {Object.entries(duplicateGroupsByType).map(
            ([key, groups]: [key: string, groups: IDuplicateGroup[]]) =>
              groups.length > 0 && (
                <TreeNode key={key} isRoot={true} name={key} node={groups} />
              ),
          )}
        </div>
      )}
    </>
  );
}

export default Tree;
