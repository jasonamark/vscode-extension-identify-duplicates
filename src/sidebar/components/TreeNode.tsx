import React, { useState } from 'react';
import { IDuplicateGroup, ITreeObject } from '../types';

const FolderIcon = () => <span>📁</span>;
const CssIcon = () => <span>🎨</span>;
const EnumIcon = () => <span>📜</span>;
const InterfaceIcon = () => <span>📄</span>;
const MethodIcon = () => <span>🔧</span>;

const getIconForType = (objectType: string) => {
  switch (objectType) {
    case 'css':
      return <CssIcon />;
    case 'enum':
      return <EnumIcon />;
    case 'interface':
      return <InterfaceIcon />;
    case 'method':
      return <MethodIcon />;
    default:
      return null;
  }
};

export interface ITreeNodeProps {
	node: IDuplicateGroup | ITreeObject;
  objectType?: string;
	isRoot?: boolean;
}

export function TreeNode({ node, objectType, isRoot }: ITreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(isRoot || false);

  const isGroup = (node as IDuplicateGroup).duplicates !== undefined;

  if (isGroup) {
    return (
      <div>
        <div onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '▼' : '▶'} {isRoot && <FolderIcon />} {objectType}
        </div>
        {isExpanded && (
          <div style={{ marginLeft: '20px' }}>
            {(node as IDuplicateGroup).duplicates.map((child, index) => (
              <TreeNode key={index} node={child} objectType={child.objectType} />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    const treeObject = node as ITreeObject;
    return (
      <div>
        {getIconForType(treeObject.objectType)} {treeObject.name}
      </div>
    );
  }
};