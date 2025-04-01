import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  onMount?: (editor: any) => void;
  darkMode?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  height = '100%',
  onMount,
  darkMode = false
}) => {
  return (
    <div 
      className="code-editor-container"
      style={{ 
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        display: 'grid',
        minHeight: 0,
      }}
    >
      <CodeMirror
        value={value}
        height="100%"
        width="100%"
        theme={darkMode ? 'dark' : 'light'}
        onChange={onChange}
        extensions={[javascript()]}
        style={{ 
          height: '100%', 
          minHeight: 0,
          flex: 1,
        }}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: false,
          autocompletion: true
        }}
      />
    </div>
  );
};

export default CodeEditor; 