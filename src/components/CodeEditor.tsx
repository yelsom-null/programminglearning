import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  darkMode?: boolean;
  name?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  darkMode = true,
  name = "js_editor"
}) => {
  const editorRef = useRef<any>(null);
  
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #ccc',
    borderRadius: '4px'
  };

  // Store editor reference
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Force focus on the editor to make cursor visible
    editor.focus();
    
    // Ensure editor is properly sized
    editor.layout();
  };

  // Handle value change from Monaco
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div style={containerStyle} onClick={() => editorRef.current?.focus()}>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        defaultValue={value}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={darkMode ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'off',
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 10,
          renderWhitespace: 'selection',
          // Cursor settings for better visibility
          cursorBlinking: 'blink',
          cursorStyle: 'line',
          cursorWidth: 10,
          cursorSmoothCaretAnimation: 'off',
          
        }}
      />
    </div>
  );
};

export default CodeEditor; 