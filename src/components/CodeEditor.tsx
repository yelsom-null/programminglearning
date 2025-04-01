import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  darkMode?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  darkMode = true
}) => {
  // Handle value change from Monaco
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div 
      className="code-editor-container"
      style={{ 
        height: '400px',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <Editor
        height="400px"
        defaultLanguage="javascript"
        defaultValue={value}
        value={value}
        onChange={handleEditorChange}
        theme={darkMode ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 10,
          renderWhitespace: 'none',
          cursorSmoothCaretAnimation: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor; 