import React, { ReactNode } from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CodeBlockProps {
  children: ReactNode;
}

// Custom styled component for code blocks
const CodePaper = styled(Paper)(({ theme }) => ({
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  padding: theme.spacing(2),
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.03)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'}`,
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  }
}));

const CodeBlock: React.FC<CodeBlockProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <CodePaper elevation={0}>
      <Box component="code" sx={{ 
        color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333',
        display: 'block'
      }}>
        {children}
      </Box>
    </CodePaper>
  );
};

export default CodeBlock; 