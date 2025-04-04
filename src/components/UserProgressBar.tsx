import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Badge,
  Tooltip,
  useTheme,
  Avatar,
  Chip
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Define badge types
export interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// List of available badges
export const AVAILABLE_BADGES: Record<string, BadgeData> = {
  'first-lesson-complete': {
    id: 'first-lesson-complete',
    name: 'First Steps',
    description: 'Completed your first lesson',
    icon: '🥇',
    color: '#FFD700'
  },
  'streak-3-days': {
    id: 'streak-3-days',
    name: 'On Fire!',
    description: 'Learned for 3 days in a row',
    icon: '🔥',
    color: '#FF4500'
  },
  'all-fundamentals-complete': {
    id: 'all-fundamentals-complete',
    name: 'Foundation Builder',
    description: 'Completed all fundamentals lessons',
    icon: '🏆',
    color: '#9C27B0'
  },
  'code-master': {
    id: 'code-master',
    name: 'Code Master',
    description: 'Completed all code exercises in a lesson',
    icon: '⭐',
    color: '#FFC107'
  },
  'quick-learner': {
    id: 'quick-learner',
    name: 'Quick Learner',
    description: 'Completed a lesson in under 10 minutes',
    icon: '⚡',
    color: '#2196F3'
  }
};

interface UserProgressBarProps {
  lessonId: string;
  completionPercentage: number;
  points: number;
  streak: number;
  badges: string[];
  compact?: boolean;
}

const UserProgressBar: React.FC<UserProgressBarProps> = ({
  lessonId,
  completionPercentage,
  points,
  streak,
  badges,
  compact = false
}) => {
  const theme = useTheme();
  
  // Get color based on completion percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return theme.palette.error.main;
    if (percentage < 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: compact ? 1 : 2,
        border: `1px solid ${theme.palette.divider}`,
        width: '100%'
      }}
    >
      {!compact && (
        <Typography variant="h6" gutterBottom>
          Your Progress
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Progress bar */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Lesson Progress
            </Typography>
            <Typography variant="body2" fontWeight="bold" color={getProgressColor(completionPercentage)}>
              {completionPercentage}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={completionPercentage} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: theme.palette.action.hover,
              '& .MuiLinearProgress-bar': {
                bgcolor: getProgressColor(completionPercentage)
              }
            }}
          />
        </Box>
        
        {/* Points and streak */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Tooltip title="Points earned from completing lessons and exercises">
            <Chip
              icon={<EmojiEventsIcon />}
              label={`${points} Points`}
              variant="outlined"
              color="primary"
              size={compact ? "small" : "medium"}
            />
          </Tooltip>
          
          <Tooltip title="Days in a row you've been learning">
            <Chip
              icon={<LocalFireDepartmentIcon />}
              label={`${streak} Day Streak`}
              variant="outlined"
              color="error"
              size={compact ? "small" : "medium"}
              sx={{
                '& .MuiChip-icon': {
                  color: streak > 0 ? theme.palette.error.main : theme.palette.text.disabled
                }
              }}
            />
          </Tooltip>
        </Box>
        
        {/* Badges */}
        {!compact && badges.length > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Badges Earned
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              mt: 1
            }}>
              {badges.map(badgeId => {
                const badge = AVAILABLE_BADGES[badgeId];
                if (!badge) return null;
                
                return (
                  <Tooltip 
                    key={badgeId} 
                    title={`${badge.name}: ${badge.description}`}
                    arrow
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: `${badge.color}40`,
                        color: badge.color,
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      {badge.icon}
                    </Avatar>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
        )}
        
        {/* Compact badges display */}
        {compact && badges.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 0.5
          }}>
            {badges.slice(0, 3).map(badgeId => {
              const badge = AVAILABLE_BADGES[badgeId];
              if (!badge) return null;
              
              return (
                <Tooltip 
                  key={badgeId} 
                  title={`${badge.name}: ${badge.description}`}
                  arrow
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: `${badge.color}40`,
                      color: badge.color,
                      fontSize: '0.8rem'
                    }}
                  >
                    {badge.icon}
                  </Avatar>
                </Tooltip>
              );
            })}
            
            {badges.length > 3 && (
              <Tooltip title="More badges earned" arrow>
                <Chip
                  label={`+${badges.length - 3}`}
                  size="small"
                  sx={{ height: 24, minWidth: 32 }}
                />
              </Tooltip>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default UserProgressBar; 