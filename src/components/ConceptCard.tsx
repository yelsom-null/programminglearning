import React, { ReactNode } from 'react';
import { Card, CardHeader, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ConceptCardProps {
  title: string;
  children: ReactNode;
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.background.paper 
    : theme.palette.grey[50],
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ConceptCard: React.FC<ConceptCardProps> = ({ title, children }) => {
  return (
    <StyledCard>
      <StyledCardHeader 
        title={<Typography variant="h6">{title}</Typography>}
        disableTypography
      />
      <StyledCardContent>
        {children}
      </StyledCardContent>
    </StyledCard>
  );
};

export default ConceptCard; 