import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  useTheme, 
  Fade
} from '@mui/material';

// Define the types of data that can be visualized
type MemoryDataType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null' | 'undefined';

// Interface for a memory cell in our visualization
interface MemoryCell {
  name: string;
  value: any;
  type: MemoryDataType;
  address: string; // Simulated memory address
}

interface InteractiveMemoryDiagramProps {
  // Code to evaluate and visualize
  code: string;
  // Additional variables to include in visualization (e.g., from code editor)
  externalVariables?: Record<string, any>;
  // Height of the diagram
  height?: number | string;
  // If true, will animate changes
  animate?: boolean;
}

const InteractiveMemoryDiagram: React.FC<InteractiveMemoryDiagramProps> = ({
  code,
  externalVariables = {},
  height = 300,
  animate = true
}) => {
  const theme = useTheme();
  const [memoryCells, setMemoryCells] = useState<MemoryCell[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Generate a fake memory address
  const generateAddress = () => {
    return '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
  };
  
  // Determine the type of a value
  const getValueType = (value: any): MemoryDataType => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return typeof value as MemoryDataType;
  };
  
  // Format a value for display
  const formatValue = (value: any, type: MemoryDataType): string => {
    if (type === 'null') return 'null';
    if (type === 'undefined') return 'undefined';
    if (type === 'string') return `"${value}"`;
    if (type === 'array') return JSON.stringify(value);
    if (type === 'object') return JSON.stringify(value);
    return String(value);
  };
  
  // Get color for data type
  const getTypeColor = (type: MemoryDataType): string => {
    switch(type) {
      case 'string': return theme.palette.success.main;
      case 'number': return theme.palette.primary.main;
      case 'boolean': return theme.palette.warning.main;
      case 'array': return theme.palette.error.main;
      case 'object': return theme.palette.info.main;
      case 'null': return theme.palette.grey[500];
      case 'undefined': return theme.palette.grey[700];
      default: return theme.palette.grey[500];
    }
  };
  
  // Evaluate the code and extract variables
  useEffect(() => {
    try {
      setError(null);
      
      // Create a function to evaluate the code safely
      const evalCode = new Function(`
        try {
          ${code}
          return { variables: { ...this }, error: null };
        } catch (e) {
          return { variables: {}, error: e.message };
        }
      `);
      
      // Execute the code and get variables
      const result = evalCode.call({ ...externalVariables });
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      // Transform variables into memory cells
      const cells: MemoryCell[] = Object.entries(result.variables)
        .filter(([key]) => !key.startsWith('_') && key !== 'window' && key !== 'globalThis')
        .map(([name, value]) => {
          const type = getValueType(value);
          return {
            name,
            value,
            type,
            address: generateAddress()
          };
        });
      
      setMemoryCells(cells);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
  }, [code, externalVariables]);
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        height,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box 
        sx={{ 
          p: 1, 
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Memory Visualization
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {memoryCells.length} variables in memory
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          p: 2, 
          flex: 1,
          overflowY: 'auto',
          background: `repeating-linear-gradient(
            0deg,
            ${theme.palette.background.default},
            ${theme.palette.background.default} 20px,
            ${theme.palette.action.hover} 20px,
            ${theme.palette.action.hover} 40px
          )`
        }}
      >
        {error ? (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'error.lighter', 
              borderRadius: 1,
              border: `1px solid ${theme.palette.error.main}`
            }}
          >
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        ) : memoryCells.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%' 
            }}
          >
            <Typography color="text.secondary" variant="body1">
              No variables to display
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {memoryCells.map((cell, index) => (
              <Fade key={cell.name} in={true} timeout={animate ? 500 : 0} style={{ transitionDelay: animate ? `${index * 100}ms` : '0ms' }}>
                <Paper 
                  elevation={1}
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                    borderLeft: `4px solid ${getTypeColor(cell.type)}`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      bgcolor: 'background.paper'
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {cell.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ 
                        bgcolor: `${getTypeColor(cell.type)}20`,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        color: getTypeColor(cell.type)
                      }}>
                        {cell.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cell.address}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: theme.palette.background.default }}>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {formatValue(cell.value, cell.type)}
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default InteractiveMemoryDiagram; 