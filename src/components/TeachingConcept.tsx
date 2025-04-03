import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Divider,
  useTheme,
  SxProps,
  Theme 
} from '@mui/material';
import CodeBlock from './CodeBlock';

// Allowed block types to enforce a consistent teaching pattern
export type ContentBlockType = 
  | 'text' 
  | 'code' 
  | 'note' 
  | 'warning' 
  | 'tip' 
  | 'exercise';

// Content block structure for each teaching element
interface ContentBlock {
  type: ContentBlockType;
  content: string | React.ReactNode;
  caption?: string;
}

interface TeachingConceptProps {
  title: string;
  subtitle?: string;
  conceptNumber?: number;
  blocks: ContentBlock[];
  sx?: SxProps<Theme>;
}

const TeachingConcept: React.FC<TeachingConceptProps> = ({
  title,
  subtitle,
  conceptNumber,
  blocks,
  sx
}) => {
  const theme = useTheme();

  // Get styling based on block type
  const getBlockStyle = (type: ContentBlockType) => {
    switch(type) {
      case 'note':
        return {
          bgcolor: 'info.lighter',
          borderLeft: `4px solid ${theme.palette.info.main}`,
          p: 2,
          my: 2,
          borderRadius: 1
        };
      case 'warning':
        return {
          bgcolor: 'warning.lighter',
          borderLeft: `4px solid ${theme.palette.warning.main}`,
          p: 2,
          my: 2,
          borderRadius: 1
        };
      case 'tip':
        return {
          bgcolor: 'success.lighter',
          borderLeft: `4px solid ${theme.palette.success.main}`,
          p: 2,
          my: 2,
          borderRadius: 1
        };
      case 'exercise':
        return {
          bgcolor: 'primary.lighter',
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          p: 2,
          my: 2,
          borderRadius: 1
        };
      default:
        return { my: 2 };
    }
  };

  // Render the appropriate block based on type
  const renderBlock = (block: ContentBlock, index: number) => {
    switch(block.type) {
      case 'code':
        return (
          <Box key={index} sx={{ mb: 2 }}>
            {block.caption && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                {block.caption}
              </Typography>
            )}
            <CodeBlock>
              {typeof block.content === 'string' ? block.content : ''}
            </CodeBlock>
          </Box>
        );
      case 'text':
        return (
          <Typography key={index} variant="body1" paragraph>
            {block.content}
          </Typography>
        );
      default:
        return (
          <Box key={index} sx={getBlockStyle(block.type)}>
            {block.caption && (
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {block.caption}
              </Typography>
            )}
            {typeof block.content === 'string' ? (
              <Typography variant="body1">
                {block.content}
              </Typography>
            ) : block.content}
          </Box>
        );
    }
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        mb: 4, 
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        ...sx
      }}
    >
      <Box sx={{ 
        p: 2, 
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {conceptNumber !== undefined && (
            <Box 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'primary.contrastText', 
                borderRadius: '50%', 
                width: 28, 
                height: 28, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}
            >
              {conceptNumber}
            </Box>
          )}
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ p: 3 }}>
        {blocks.map((block, index) => renderBlock(block, index))}
      </Box>
    </Paper>
  );
};

export default TeachingConcept; 