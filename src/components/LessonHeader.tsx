import React from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link as MuiLink, 
  Paper, 
  Button 
} from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/material/styles';

interface LessonHeaderProps {
  title: string;
  chapterTitle: string;
  currentLessonIndex: number;
  totalLessons: number;
  prevLesson?: { title: string; route: string };
  nextLesson?: { title: string; route: string };
}

const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  chapterTitle,
  currentLessonIndex,
  totalLessons,
  prevLesson,
  nextLesson,
}) => {
  return (
    <HeaderPaper>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={Link} to="#" color="inherit">
            {chapterTitle}
          </MuiLink>
          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {chapterTitle}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {prevLesson ? (
            <Link to={prevLesson.route} style={{ textDecoration: 'none', marginRight: 8 }}>
              <Button
                variant="outlined" 
                color="primary"
                startIcon={<ArrowBackIcon />}
                size="small"
              >
                Previous Lesson
              </Button>
            </Link>
          ) : (
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<ArrowBackIcon />}
              size="small"
              disabled
              sx={{ mr: 1 }}
            >
              Previous Lesson
            </Button>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
            Lesson {currentLessonIndex} of {totalLessons}
          </Typography>
          
          {nextLesson ? (
            <Link to={nextLesson.route} style={{ textDecoration: 'none', marginLeft: 8 }}>
              <Button
                variant="contained" 
                color="primary"
                endIcon={<ArrowForwardIcon />}
                size="small"
              >
                Next Lesson
              </Button>
            </Link>
          ) : (
            <Button 
              variant="contained" 
              color="primary"
              endIcon={<ArrowForwardIcon />}
              size="small"
              disabled
              sx={{ ml: 1 }}
            >
              Next Lesson
            </Button>
          )}
        </Box>
      </Box>
    </HeaderPaper>
  );
};

export default LessonHeader; 