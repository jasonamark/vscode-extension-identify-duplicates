import {
  VSCodeButton,
  VSCodeDataGrid,
  VSCodeDataGridCell,
  VSCodeDataGridRow,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import * as React from "react";
import "./styles.css";
import { useCallback, useState } from "react";

declare const acquireVsCodeApi: <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
};

const vscode = acquireVsCodeApi<{ message: string }>();

const defaultRootDirectory =
  process.env.NODE_ENV === "development"
    ? "/Users/jasonmark/Documents/REV/11Series"
    : "";

export function App() {
  const [excludedDirectories, setExcludedDirectories] = useState("");
  const [rootDirectory, setRootDirectory] = useState(defaultRootDirectory);

  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      console.log('!! app event received', event);
    });

    fetchDuplicates();
  }, []);
  
  const fetchDuplicates = useCallback(() => {
    vscode.postMessage({
      command: "fetchDuplicates",
      data: { rootDirectory, excludedDirectories },
    });
  }, [rootDirectory, excludedDirectories]);

  return (
    <div className="app">
      <div className="column">
        <div className="include-text">files to include</div>
        <VSCodeTextField
          className="control"
          value={rootDirectory}
          onInput={(e: any) => {
            setRootDirectory(e.target.value);
          }}
          placeholder="e.g. ./src"
          autofocus
        />
        <div className="exclude-text">files to exclude</div>
        <VSCodeTextField
          className="control mb2"
          value={excludedDirectories}
          onInput={(e: any) => {
            setExcludedDirectories(e.target.value);
          }}
          placeholder="e.g. *helpers, folder"
        />
      </div>
    </div>
  );
}

export default App;
