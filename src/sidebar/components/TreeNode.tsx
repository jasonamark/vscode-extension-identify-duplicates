import React, { useState } from 'react';
import { IDuplicateGroup, ITreeObject } from '../types';
import "./styles.css";
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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
	node: IDuplicateGroup[] | ITreeObject;
  objectGroup?: string;
	isFolder?: boolean;
}

export function TreeNode({ node, objectGroup, isFolder }: ITreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(isFolder || false);

  const isGroup = 'duplicates' in node;

  console.log('!! objectGroup node', objectGroup, node);

  if (objectGroup) {
    return (
      <div>
        <div className='node' onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronDownIcon className="arrow"/> : <ChevronRightIcon className="arrow"/>} {isFolder && <FolderIcon />} {objectGroup}
        </div>
        {isExpanded && (

          <div style={{ marginLeft: '20px' }}>
            {(node as IDuplicateGroup[]).map((duplicateGroup, index) => (
              {ChevronDownIcon className="arrow"/> {isFolder && <FolderIcon />} {objectGroup}
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