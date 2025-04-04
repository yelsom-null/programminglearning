import React from 'react';
import { 
  Box, 
  Paper, 
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import '../styles/CodeBlockStyles.scss';

interface CodeBlockProps {
  children: React.ReactNode;
  maxHeight?: string | number;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  children, 
  maxHeight = 'none',
  language = 'javascript'
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const handleCopyCode = () => {
    if (typeof children === 'string') {
      // Create a clean version of the code without the output annotations
      const cleanCode = children.split('\n')
        .map(line => line.split('Outputs:')[0].trim())
        .join('\n');
      
      navigator.clipboard.writeText(cleanCode);
    }
  };
  
  // Helper function to process code lines for improved readability
  const processCodeLines = (code: string) => {
    if (typeof code !== 'string') return code;
    
    // Split into lines
    const lines = code.split('\n');
    
    // Process each line
    return lines.map((line, index) => {
      // Look for "Outputs:" comments to highlight them
      if (line.includes('Outputs:')) {
        const [codePart, output] = line.split('Outputs:');
        return (
          <div key={index} className="code-line">
            <span className="line-number">{index + 1}</span>
            <div className="line-content">
              <span>{codePart}</span>
              <div className="output-line">
                <span className="output-arrow">
                  <ArrowRightAltIcon fontSize="small" />
                </span>
                {output.trim()}
              </div>
            </div>
          </div>
        );
      }
      
      // Style comment lines (starting with //)
      if (line.trim().startsWith('//')) {
        // Extract the comment text without the slashes
        const commentText = line.trim().substring(2).trim();
        const indentation = line.match(/^\s*/)?.[0] || ''; // Preserve indentation
        
        return (
          <div key={index} className="code-line">
            <span className="line-number">{index + 1}</span>
            <div className="line-content comment-line">
              {indentation}
              <span className="comment-bar">{commentText}</span>
            </div>
          </div>
        );
      }
      
      // Apply basic syntax highlighting for keywords
      let processedLine = line;
      const keywords = ['let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from'];
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        processedLine = processedLine.replace(regex, `<span class="keyword">${keyword}</span>`);
      });
      
      // Highlight strings
      processedLine = processedLine.replace(
        /(["'])(.*?)\1/g, 
        '<span class="string">$&</span>'
      );
      
      // Highlight numbers
      processedLine = processedLine.replace(
        /\b(\d+)\b/g,
        '<span class="number">$&</span>'
      );
      
      // Regular line with syntax highlighting
      return (
        <div key={index} className="code-line">
          <span className="line-number">{index + 1}</span>
          <div 
            className="line-content" 
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    });
  };

  return (
    <div className={`code-block-container ${!isDarkMode ? 'light-theme' : ''}`}>
      <div className="code-block-header">
        <div className="language-label">
          <CodeIcon fontSize="small" style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
          {language}
        </div>
        <div className="action-buttons">
          <Tooltip title="Copy code">
            <IconButton 
              size="small" 
              className="action-button" 
              onClick={handleCopyCode}
              aria-label="Copy code"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      
      <div 
        className="code-block-content" 
        style={{ maxHeight }}
      >
        {typeof children === 'string' ? processCodeLines(children) : children}
      </div>
    </div>
  );
};

export default CodeBlock; 