import React, { useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const EditorWithFormatting = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Load saved content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  // Handle text input
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (chars, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const blockText = currentContent.getBlockForKey(blockKey).getText();

    // Detect special character patterns and apply styles
    if (blockText === "" && chars === " ") {
      const updatedState = editorState;
      setEditorState(updatedState);
    } else if (blockText === "#" && chars === " ") {
      const newState = RichUtils.toggleBlockType(editorState, "header-one");
      setEditorState(
        EditorState.push(
          newState,
          Modifier.removeRange(
            newState.getCurrentContent(),
            selection,
            "backward"
          )
        )
      );
      return "handled";
    } else if (blockText === "*" && chars === " ") {
      const newState = RichUtils.toggleInlineStyle(editorState, "BOLD");
      setEditorState(
        EditorState.push(
          newState,
          Modifier.removeRange(
            newState.getCurrentContent(),
            selection,
            "backward"
          )
        )
      );
      return "handled";
    } else if (blockText === "**" && chars === " ") {
      const newState = RichUtils.toggleInlineStyle(editorState, "RED");
      setEditorState(
        EditorState.push(
          newState,
          Modifier.removeRange(
            newState.getCurrentContent(),
            selection,
            "backward"
          )
        )
      );
      return "handled";
    } else if (blockText === "***" && chars === " ") {
      const newState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
      setEditorState(
        EditorState.push(
          newState,
          Modifier.removeRange(
            newState.getCurrentContent(),
            selection,
            "backward"
          )
        )
      );
      return "handled";
    }

    return "not-handled";
  };

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
    alert("Content saved!");
  };

  const styleMap = {
    RED: { color: "red" },
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
        border: "1px solid #ddd",
      }}
    >
      <h2>Demo editor by Suhani</h2>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={(chars) => handleBeforeInput(chars, editorState)}
        customStyleMap={styleMap}
      />
      <button
        onClick={saveContent}
        style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}
      >
        Save
      </button>
    </div>
  );
};

export default EditorWithFormatting;
