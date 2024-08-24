import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import * as React from "react";
import "./styles.css";
import { useCallback, useEffect, useState } from "react";
import { IDuplicateGroupsByType } from "../findDuplicateGroupsByType";
import Tree from "./tree/Tree";
import * as l10n from '@vscode/l10n'

const FETCH_DEBOUNCE_DELAY = 1000;

const defaultRootDirectory =
  process.env.NODE_ENV === "development"
    ? "/Users/jasonmark/Documents/REV/11Series"
    : "";

declare const acquireVsCodeApi: <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
};

export const vscode = acquireVsCodeApi<{ message: string }>();

export function App() {
  const [duplicateGroupsByType, setDuplicateGroupsByType] =
    useState<IDuplicateGroupsByType | null>(null);
  const [excludedDirectories, setExcludedDirectories] = useState("");
  const [rootDirectory, setRootDirectory] = useState(defaultRootDirectory);
  const [isLocalizationReady, setIsLocalizationReady] = useState(false);

  const isFetchingDuplicates = Boolean(!duplicateGroupsByType);

  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.command === "fetchDuplicates") {
        setDuplicateGroupsByType(event.data.duplicateGroupsByType);
      } else if (event.data.command === "fetchLocalization") {
        l10n.config({
          contents: event.data.localization
        })
        setIsLocalizationReady(true);
      }
    });

    fetchLocalization();
    fetchDuplicates();
  }, []);

  const fetchLocalization = () => {
    vscode.postMessage({
      command: "fetchLocalization",
    });
  }

  const fetchDuplicates = useCallback(() => {
    const handler = setTimeout(() => {
      vscode.postMessage({
        command: "fetchDuplicates",
        data: { rootDirectory, excludedDirectories },
      });
    }, FETCH_DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [rootDirectory, excludedDirectories]);

  useEffect(() => {
    fetchDuplicates();
  }, [rootDirectory, excludedDirectories, fetchDuplicates]);

  if (!isLocalizationReady) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="column">
        <div className="include-text">{l10n.t("Root Directory")}</div>
        <VSCodeTextField
          className="control"
          value={rootDirectory}
          onInput={(e: any) => {
            setRootDirectory(e.target.value);
          }}
          placeholder={l10n.t("e.g. src/views")}
          autofocus
        />
        <div className="exclude-text">{l10n.t("Directories To Exclude")}</div>
        <VSCodeTextField
          className="control mb1"
          value={excludedDirectories}
          onInput={(e: any) => {
            setExcludedDirectories(e.target.value);
          }}
          placeholder={l10n.t("e.g. common, folder")}
        />
      </div>
      {isFetchingDuplicates && <div className="loading">{l10n.t("Loading")}...</div>}
      {duplicateGroupsByType && (
        <Tree duplicateGroupsByType={duplicateGroupsByType} />
      )}
    </div>
  );
}

export default App;
