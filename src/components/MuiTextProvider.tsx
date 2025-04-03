import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled component for code blocks
const CodeText = styled(Box)(({ theme }) => ({
  fontFamily: '"Courier New", Courier, monospace',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  padding: '2px 4px',
  borderRadius: '3px',
  fontSize: '0.9em',
  display: 'inline-block',
}));

// Component to automatically convert basic HTML to MUI Typography
const MuiTextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const convertChildren = (child: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const { type, props } = child;
    
    // Process based on element type
    if (typeof type === 'string') {
      switch (type) {
        case 'h1':
          return <Typography variant="h3" component="h1" gutterBottom>{props.children}</Typography>;
        case 'h2':
          return <Typography variant="h4" component="h2" gutterBottom>{props.children}</Typography>;
        case 'h3':
          return <Typography variant="h5" component="h3" gutterBottom>{props.children}</Typography>;
        case 'h4':
          return <Typography variant="h6" component="h4" gutterBottom>{props.children}</Typography>;
        case 'p':
          return <Typography variant="body1" paragraph>{props.children}</Typography>;
        case 'span':
          return <Typography variant="body2" component="span">{props.children}</Typography>;
        case 'small':
          return <Typography variant="caption" component="small">{props.children}</Typography>;
        case 'code':
          return <CodeText component="code">{props.children}</CodeText>;
        default:
          // For other elements, just process their children
          return React.cloneElement(child, {
            ...props,
            children: React.Children.map(props.children, convertChildren)
          });
      }
    }
    
    // For custom components, just process their children
    return React.cloneElement(child, {
      ...props,
      children: React.Children.map(props.children, convertChildren)
    });
  };

  return <>{React.Children.map(children, convertChildren)}</>;
};

export default MuiTextProvider; 