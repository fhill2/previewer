// https://dev.to/adamcollier/adding-codemirror-6-to-a-react-project-36hl

import React, { useRef, useEffect, forwardRef, useState } from "react";
import { ipcRenderer } from "electron";

// import { EditorState } from '@codemirror/state';
// import { EditorView, keymap } from '@codemirror/view';
// import { defaultKeymap } from '@codemirror/commands';
import {
  loadLanguage,
  langNames,
  langs,
} from "@uiw/codemirror-extensions-langs";
// import CodeMirror, { ReactCodeMirrorRef } from 'react-codemirror';
import { useCodeMirror } from "@uiw/react-codemirror";

// https://codesandbox.io/embed/react-codemirror-example-codemirror-6-hook-yr4vg?fontsize=14&hidenavigation=1&theme=dark
// https://github.com/uiwjs/react-codemirror/issues/408

// import { EditorState, Compartment } from '@codemirror/state';
// import { htmlLanguage, html } from '@codemirror/lang-html';
import findModeByFileName from "./codemirror-lang";

function getMaxWidthHeight(str) {
  const lines = str.split("\n");
  let maxCharCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const lineCharCount = lines[i].length;
    if (lineCharCount > maxCharCount) {
      maxCharCount = lineCharCount;
    }
  }
  return [maxCharCount, lines.length];
}

export const Editor = ({ filepath }) => {
  const [text, setText] = useState(null);
  const [extensions, setExtensions] = useState([]);
  const editor = useRef();

  const { setContainer } = useCodeMirror({
    container: editor.current,
    value: text,
    extensions: extensions,
    theme: "dark",
  });

  useEffect(() => {
    fetch("file://" + filepath)
      .then((response) => response.text())
      .then((data) => {
        let mode = findModeByFileName(filepath).mode;
        // mode is null if filepath is plain text
        let exts;
        try {
          exts = [langs[mode]()];
        } catch {
          exts = [];
        }
        setExtensions(exts);
        // set width to the max line char count and send to main for win.setSize()
        let wh = getMaxWidthHeight(data);
        ipcRenderer.send("custom-endpoint", {
          command: "resize",
          data: { width: wh[0], height: wh[1] },
        });
        setText(data);
      });
  }, [filepath]);

  return <div ref={editor} />;
};
