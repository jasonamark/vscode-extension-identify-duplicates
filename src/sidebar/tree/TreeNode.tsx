import React, { useState } from "react";
import { IDuplicateGroup, ITreeObject } from "../types";
import "./styles.css";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import closedFolder from "../../assets/folder_closed.svg";
import css from "../../assets/file_type_css.svg";
import defaultFile from "../../assets/default_file.svg";
import javascript from "../../assets/file_type_js.svg";
import less from "../../assets/file_type_less.svg";
import openFolder from "../../assets/folder_opened.svg";
import scss from "../../assets/file_type_scss.svg";
import typescript from "../../assets/file_type_typescript.svg";
import { vscode } from "../App";

const getIconForType = (filePath: string) => {
  let extension = filePath.split(".").pop();
  let src = defaultFile;
  if (extension === "ts" || extension === "tsx") {
    src = typescript;
  } else if (extension === "js" || extension === "jsx") {
    src = javascript;
  } else if (extension === "less") {
    src = less;
  } else if (extension === "scss") {
    src = scss;
  } else if (extension === "css") {
    src = css;
  }
  return <img className="icon" src={src} />;
};

export interface ITreeNodeProps {
  node: IDuplicateGroup[] | IDuplicateGroup | ITreeObject[] | ITreeObject;
  name: string;
  isRoot?: boolean;
  isGroup?: boolean;
}

export function TreeNode({ isRoot, isGroup, node, name }: ITreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const openDocument = () => {
    vscode.postMessage({
      command: "openDocument",
      data: { treeObject: node },
    });
  };

  if (isRoot) {
    return (
      <div>
        <div className="root" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <>
              <ChevronDownIcon className="arrow" />
              <img className="icon" src={openFolder} />
            </>
          ) : (
            <>
              <ChevronRightIcon className="arrow" />
              <img className="icon" src={closedFolder} />
            </>
          )}{" "}
          {name}
        </div>
        {isExpanded &&
          (node as IDuplicateGroup[]).map((duplicateGroup, index) => (
            <TreeNode
              key={`${duplicateGroup.duplicates[0].name}_${index}`}
              name={duplicateGroup.duplicates[0].name}
              node={duplicateGroup.duplicates}
              isGroup={true}
            />
          ))}
      </div>
    );
  } else if (isGroup) {
    return (
      <div>
        <div className="group" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <>
              <ChevronDownIcon className="arrow" />
              <img className="icon" src={openFolder} />
            </>
          ) : (
            <>
              <ChevronRightIcon className="arrow" />
              <img className="icon" src={closedFolder} />
            </>
          )}{" "}
          {name}
        </div>
        {isExpanded &&
          (node as ITreeObject[]).map((treeObject, index) => (
            <TreeNode
              key={`${treeObject.name}_${index}`}
              name={treeObject.name}
              node={treeObject}
            />
          ))}
      </div>
    );
  } else {
    const treeObject = node as ITreeObject;
    return (
      <div>
        <div className="leaf" onClick={() => openDocument()}>
          {getIconForType(treeObject.filePath)} {treeObject.name}
        </div>
      </div>
    );
  }
}
