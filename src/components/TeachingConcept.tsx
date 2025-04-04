import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Divider,
  useTheme,
  SxProps,
  Theme,
  Collapse,
  Button,
  IconButton,
  Fade,
  Tooltip,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  alpha,
  Popover
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeBlock from './CodeBlock';
import InteractiveMemoryDiagram from './InteractiveMemoryDiagram';
import { useProgress } from '../utils/useProgress';
import AddIcon from '@mui/icons-material/Add';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import QuizIcon from '@mui/icons-material/Quiz';
import HighlightIcon from '@mui/icons-material/Highlight';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PreviewIcon from '@mui/icons-material/Preview';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import ReplayIcon from '@mui/icons-material/Replay';
import { motion } from 'framer-motion';

// Allowed block types to enforce a consistent teaching pattern
export type ContentBlockType = 
  | 'text' 
  | 'code' 
  | 'note' 
  | 'warning' 
  | 'tip' 
  | 'exercise'
  | 'memory-diagram'
  | 'quiz'
  | 'advanced'
  | 'highlight'
  | 'visualization'
  | 'related-concepts'
  | 'alternative-explanation';

// Quiz question structure
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Define a KeyTerm type for highlighting technical terms
interface KeyTerm {
  term: string;
  definition: string;
}

// Define a VisualizationData type for graphical representations
interface VisualizationData {
  type: 'container' | 'flow' | 'comparison' | 'tree' | 'custom';
  title?: string;
  description?: string;
  imageSrc?: string;
  data?: any; // For custom visualizations
}

// Define a RelatedConcept type for contextual learning paths
interface RelatedConcept {
  title: string;
  lessonId: string;
  conceptId?: string | number;
  description: string;
  isPrerequisite?: boolean;
}

// Content block structure for each teaching element
interface ContentBlock {
  type: ContentBlockType;
  content: string | React.ReactNode;
  caption?: string;
  interactiveParams?: {
    code?: string;
    variables?: Record<string, any>;
  };
  // For quizzes
  quiz?: QuizQuestion;
  // For advanced content
  advancedTitle?: string;
  // For code highlighting
  highlights?: {
    lineNumbers: number[];
    explanation: string;
  }[];
  // For key terms highlighting
  keyTerms?: KeyTerm[];
  // For visual metaphors and diagrams
  visualization?: VisualizationData;
  // For related concepts
  relatedConcepts?: RelatedConcept[];
  // For alternative explanations
  alternativeTitle?: string;
  // For collapsible content
  initiallyExpanded?: boolean;
}

interface TeachingConceptProps {
  title: string;
  subtitle?: string;
  conceptNumber?: number;
  lessonId: string; // Required for tracking progress
  blocks: ContentBlock[];
  sx?: SxProps<Theme>;
}

// Helper function to get icon for block type
const getBlockIcon = (type: ContentBlockType) => {
  switch(type) {
    case 'note':
      return <InfoIcon fontSize="small" />;
    case 'warning':
      return <WarningIcon fontSize="small" />;
    case 'tip':
      return <LightbulbIcon fontSize="small" />;
    case 'exercise':
      return <FitnessCenterIcon fontSize="small" />;
    case 'quiz':
      return <QuizIcon fontSize="small" />;
    case 'advanced':
      return <ExpandMoreIcon fontSize="small" />;
    case 'highlight':
      return <HighlightIcon fontSize="small" />;
    case 'visualization':
      return <ImageIcon fontSize="small" />;
    case 'related-concepts':
      return <AccountTreeIcon fontSize="small" />;
    case 'alternative-explanation':
      return <ReplayIcon fontSize="small" />;
    default:
      return null;
  }
};

// Individual teaching blocks with progressive disclosure
const TeachingBlock: React.FC<{
  block: ContentBlock;
  index: number;
  activeStep: number;
  blockType: ContentBlockType;
  theme: Theme;
  onComplete: () => void;
}> = ({ block, index, activeStep, blockType, theme, onComplete }) => {
  const [expanded, setExpanded] = useState(blockType !== 'advanced');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showHighlight, setShowHighlight] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  
  const blockRef = useRef<HTMLDivElement>(null);
  
  const isActive = index === activeStep;
  const isCompleted = index < activeStep;
  
  // Get the styling based on block type
  const getBlockStyle = () => {
    const baseStyle = {
      my: 2,
      borderRadius: 1,
      position: 'relative',
      transition: 'all 0.3s ease',
      border: isActive ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
      boxShadow: isActive ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
    };
    
    switch(blockType) {
      case 'note':
        return {
          ...baseStyle,
          bgcolor: alpha(theme.palette.info.main, 0.05),
          borderLeft: `4px solid ${theme.palette.info.main}`,
          p: 2
        };
      case 'warning':
        return {
          ...baseStyle,
          bgcolor: alpha(theme.palette.warning.main, 0.05),
          borderLeft: `4px solid ${theme.palette.warning.main}`,
          p: 2
        };
      case 'tip':
        return {
          ...baseStyle,
          bgcolor: alpha(theme.palette.success.main, 0.05),
          borderLeft: `4px solid ${theme.palette.success.main}`,
          p: 2
        };
      case 'exercise':
        return {
          ...baseStyle,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          p: 2
        };
      case 'quiz':
        return {
          ...baseStyle,
          bgcolor: alpha(theme.palette.secondary.main, 0.05),
          borderLeft: `4px solid ${theme.palette.secondary.main}`,
          p: 2
        };
      case 'advanced':
        return {
          ...baseStyle,
          bgcolor: alpha(theme.palette.grey[500], 0.05),
          p: 2
        };
      default:
        return { 
          ...baseStyle,
          my: blockType === 'text' ? 1 : 2
        };
    }
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (block.quiz && selectedQuizAnswer === block.quiz.correctAnswer) {
      // Correct answer!
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };
  
  const handleHighlightClick = (event: React.MouseEvent<HTMLElement>, lineIndex: number) => {
    setShowHighlight(lineIndex);
    setAnchorEl(event.currentTarget);
  };
  
  const handleHighlightClose = () => {
    setShowHighlight(null);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isActive && blockRef.current) {
      blockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive]);
  
  // Render based on block type
  const renderBlockContent = () => {
    if (blockType === 'code') {
      // Code block with highlighting
      const codeString = typeof block.content === 'string' ? block.content : '';
      const codeLines = codeString.split('\n');
      
      return (
        <>
          {block.caption && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              {block.caption}
            </Typography>
          )}
          <Box sx={{ position: 'relative' }}>
            <CodeBlock>
              {codeLines.map((line, lineIdx) => (
                <div key={lineIdx}>
                  {block.highlights && block.highlights.some(h => h.lineNumbers.includes(lineIdx + 1)) ? (
                    <Box 
                      component="span" 
                      sx={{ 
                        position: 'relative',
                        cursor: 'pointer',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          bgcolor: theme.palette.warning.main
                        },
                        bgcolor: alpha(theme.palette.warning.main, 0.1)
                      }}
                      onClick={(e) => handleHighlightClick(e, lineIdx + 1)}
                    >
                      {line}
                    </Box>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </CodeBlock>
            
            <Popover
              open={showHighlight !== null}
              anchorEl={anchorEl}
              onClose={handleHighlightClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Box sx={{ p: 2, maxWidth: 300 }}>
                {block.highlights && showHighlight && (
                  <Typography variant="body2">
                    {block.highlights.find(h => 
                      h.lineNumbers.includes(showHighlight)
                    )?.explanation || 'Highlighted code'}
                  </Typography>
                )}
              </Box>
            </Popover>
          </Box>
        </>
      );
    } else if (blockType === 'quiz') {
      // Quiz block
      const quiz = block.quiz;
      if (!quiz) return null;
      
      return (
        <>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2 
          }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {block.caption || 'Quick Quiz'}
            </Typography>
            <QuizIcon color="secondary" />
          </Box>
          
          <Typography variant="body1" gutterBottom>
            {quiz.question}
          </Typography>
          
          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <RadioGroup 
              value={selectedQuizAnswer} 
              onChange={(e) => setSelectedQuizAnswer(parseInt(e.target.value))}
            >
              {quiz.options.map((option, i) => (
                <FormControlLabel 
                  key={i} 
                  value={i} 
                  control={<Radio />} 
                  label={option}
                  disabled={quizSubmitted}
                />
              ))}
            </RadioGroup>
          </FormControl>
          
          {!quizSubmitted ? (
            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ mt: 2 }}
              disabled={selectedQuizAnswer === null}
              onClick={handleQuizSubmit}
            >
              Check Answer
            </Button>
          ) : (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: selectedQuizAnswer === quiz.correctAnswer ? 
                alpha(theme.palette.success.main, 0.1) : 
                alpha(theme.palette.error.main, 0.1),
              borderRadius: 1,
              borderLeft: `4px solid ${selectedQuizAnswer === quiz.correctAnswer ? 
                theme.palette.success.main : 
                theme.palette.error.main}`
            }}>
              <Typography 
                variant="body2"
                color={selectedQuizAnswer === quiz.correctAnswer ? 
                  'success.main' : 
                  'error.main'}
                fontWeight="bold"
              >
                {selectedQuizAnswer === quiz.correctAnswer ? 
                  'Correct!' : 
                  `Incorrect. The correct answer is: ${quiz.options[quiz.correctAnswer]}`}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {quiz.explanation}
              </Typography>
            </Box>
          )}
        </>
      );
    } else if (blockType === 'advanced') {
      // Advanced content with toggle
      return (
        <>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              py: 1
            }}
            onClick={handleToggleExpand}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {block.advancedTitle || 'Advanced Details'}
            </Typography>
            <IconButton size="small">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={expanded}>
            <Box sx={{ pt: 1 }}>
              {typeof block.content === 'string' ? (
                <Typography variant="body1">
                  {block.content}
                </Typography>
              ) : block.content}
            </Box>
          </Collapse>
        </>
      );
    } else if (blockType === 'memory-diagram') {
      return (
        <Box sx={{ mb: 3, mt: 3 }}>
          {block.caption && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              {block.caption}
            </Typography>
          )}
          <InteractiveMemoryDiagram 
            code={block.interactiveParams?.code || ''} 
            externalVariables={block.interactiveParams?.variables}
            height={300}
          />
        </Box>
      );
    } else if (blockType === 'visualization' && block.visualization) {
      return <VisualizationBlock visualization={block.visualization} theme={theme} />;
    } else if (blockType === 'related-concepts' && block.relatedConcepts) {
      return <RelatedConceptsList concepts={block.relatedConcepts} theme={theme} />;
    } else if (blockType === 'alternative-explanation') {
      return (
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: alpha(theme.palette.info.main, 0.05),
            borderLeft: `4px solid ${theme.palette.info.main}`,
            borderRadius: 1
          }}
        >
          <Typography 
            variant="subtitle2" 
            fontWeight="bold"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: theme.palette.info.main
            }}
          >
            <TipsAndUpdatesIcon fontSize="small" />
            {block.alternativeTitle || "Alternative Explanation"}
          </Typography>
          {typeof block.content === 'string' ? (
            <Typography 
              variant="body2" 
              sx={{ mt: 1 }}
            >
              {block.keyTerms ? 
                processKeyTerms(block.content, block.keyTerms, theme) : 
                block.content}
            </Typography>
          ) : block.content}
        </Box>
      );
    } else {
      // Default rendering for other block types
      return (
        <>
          {block.caption && (
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              {block.caption}
            </Typography>
          )}
          {typeof block.content === 'string' ? (
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ 
                maxWidth: "75ch", 
                lineHeight: 1.6, 
                fontSize: blockType === 'text' ? '1.0625rem' : 'inherit'
              }}
            >
              {block.keyTerms ? 
                processKeyTerms(block.content, block.keyTerms, theme) : 
                block.content}
            </Typography>
          ) : block.content}
          
          {/* Render related concepts if provided */}
          {block.relatedConcepts && blockType !== 'related-concepts' && (
            <Box sx={{ mt: 2 }}>
              <CollapsibleContent
                title="Related concepts"
                theme={theme}
              >
                <RelatedConceptsList 
                  concepts={block.relatedConcepts} 
                  theme={theme} 
                />
              </CollapsibleContent>
            </Box>
          )}
        </>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Box 
        ref={blockRef}
        sx={getBlockStyle()}
      >
        {/* Block header */}
        {blockType !== 'text' && blockType !== 'code' && blockType !== 'memory-diagram' && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: blockType !== 'advanced' ? 1 : 0,
            color: blockType === 'note' ? 'info.main' :
                  blockType === 'warning' ? 'warning.main' :
                  blockType === 'tip' ? 'success.main' :
                  blockType === 'exercise' ? 'primary.main' :
                  blockType === 'quiz' ? 'secondary.main' :
                  'text.secondary'
          }}>
            {getBlockIcon(blockType)}
            <Typography 
              variant="overline" 
              fontWeight="bold" 
              sx={{ ml: 0.5 }}
              color="inherit"
            >
              {blockType.charAt(0).toUpperCase() + blockType.slice(1)}
            </Typography>
          </Box>
        )}
        
        {/* Block content */}
        {renderBlockContent()}
      </Box>
    </motion.div>
  );
};

const TeachingConcept: React.FC<TeachingConceptProps> = ({
  title,
  subtitle,
  conceptNumber,
  lessonId,
  blocks,
  sx
}) => {
  const theme = useTheme();
  const { 
    completeConcept, 
    checkConceptCompleted,
    giveBadge
  } = useProgress();
  
  const [completed, setCompleted] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState(0);
  const conceptId = conceptNumber?.toString() || 'unknown';

  // Check if concept is already completed
  useEffect(() => {
    const isCompleted = checkConceptCompleted(lessonId, conceptId);
    setCompleted(isCompleted);
    
    // Automatically expand if not completed
    setExpanded(!isCompleted);
  }, [checkConceptCompleted, lessonId, conceptId]);

  // Mark concept as completed
  const handleComplete = () => {
    completeConcept(lessonId, conceptId);
    setCompleted(true);
    
    // Check for badge opportunities
    // Example: First concept completed
    if (lessonId === 'intro-to-programming' && conceptId === '1') {
      giveBadge('first-lesson-complete');
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const handleStepComplete = () => {
    if (activeStep < blocks.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // All steps completed
      handleComplete();
    }
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        mb: 4, 
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        borderLeft: completed ? `4px solid ${theme.palette.success.main}` : undefined,
        ...sx
      }}
    >
      {/* Completed badge */}
      {completed && (
        <Fade in={completed}>
          <Box 
            sx={{
              position: 'absolute',
              top: 2,
              right: 5,
              zIndex: 2,
            }}
          >
            <Tooltip title="Completed">
              <Box 
                sx={{
                  bgcolor: theme.palette.success.main,
                  color: theme.palette.success.contrastText,
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 2
                }}
              >
                <CheckCircleIcon fontSize="small" />
              </Box>
            </Tooltip>
          </Box>
        </Fade>
      )}
      
      {/* Header section */}
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: completed ? `${theme.palette.success.main}10` : 'background.paper',
          borderBottom: expanded ? `1px solid ${theme.palette.divider}` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            bgcolor: completed ? `${theme.palette.success.main}15` : theme.palette.action.hover
          }
        }}
        onClick={toggleExpand}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {conceptNumber !== undefined && (
            <Box 
              sx={{ 
                bgcolor: completed ? theme.palette.success.main : theme.palette.primary.main, 
                color: completed ? theme.palette.success.contrastText : theme.palette.primary.contrastText, 
                borderRadius: '50%', 
                width: 28, 
                height: 28, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                boxShadow: 1
              }}
            >
              {conceptNumber}
            </Box>
          )}
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {expanded ? 'Click to collapse' : 'Click to expand'}
        </Typography>
      </Box>
      
      {/* Content section */}
      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          {/* Content blocks */}
          {blocks.map((block, index) => (
            <TeachingBlock
              key={index}
              block={block}
              index={index}
              activeStep={activeStep}
              blockType={block.type}
              theme={theme}
              onComplete={handleStepComplete}
            />
          ))}
          
          {/* Mark as completed button */}
          {!completed && activeStep === blocks.length - 1 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
              >
                Mark as Completed
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

// Add a VisualizationBlock component for diagrams and metaphors
const VisualizationBlock: React.FC<{
  visualization: VisualizationData;
  theme: Theme;
}> = ({ visualization, theme }) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.primary.main, 0.05)
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        {visualization.title || "Visual Representation"}
      </Typography>
      
      {visualization.imageSrc ? (
        <Box 
          component="img" 
          src={visualization.imageSrc}
          alt={visualization.title || "Visualization"}
          sx={{ 
            maxWidth: '100%', 
            height: 'auto',
            display: 'block',
            mx: 'auto',
            my: 2,
            borderRadius: 1
          }}
        />
      ) : (
        <Box 
          sx={{ 
            height: 180, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: `1px dashed ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            my: 2
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <ImageIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {visualization.type === 'container' ? 'Variable Container Visualization' :
               visualization.type === 'flow' ? 'Code Flow Visualization' :
               visualization.type === 'comparison' ? 'Concept Comparison' :
               visualization.type === 'tree' ? 'Concept Relationship Tree' :
               'Custom Visualization'}
            </Typography>
          </Box>
        </Box>
      )}
      
      {visualization.description && (
        <Typography variant="body2" color="text.secondary">
          {visualization.description}
        </Typography>
      )}
    </Paper>
  );
};

// Add RelatedConceptsList component for contextual learning paths
const RelatedConceptsList: React.FC<{
  concepts: RelatedConcept[];
  theme: Theme;
}> = ({ concepts, theme }) => {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        Related Concepts
      </Typography>
      <Box sx={{ mt: 1 }}>
        {concepts.map((concept, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              mb: 1,
              p: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              borderLeft: `3px solid ${concept.isPrerequisite ? 
                theme.palette.warning.main : 
                theme.palette.primary.main}`,
              borderRadius: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                transform: 'translateX(2px)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Box sx={{ 
                mt: 0.5,
                color: concept.isPrerequisite ? 
                  theme.palette.warning.main : 
                  theme.palette.primary.main 
              }}>
                {concept.isPrerequisite ? 
                  <KeyboardArrowRightIcon fontSize="small" /> : 
                  <LinkIcon fontSize="small" />}
              </Box>
              <Box>
                <Button
                  variant="text"
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 'bold', p: 0, textAlign: 'left', textTransform: 'none' }}
                  href={`/lesson/${concept.lessonId}${concept.conceptId ? `#concept-${concept.conceptId}` : ''}`}
                >
                  {concept.title}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {concept.description}
                </Typography>
                {concept.isPrerequisite && (
                  <Chip 
                    label="Prerequisite" 
                    size="small" 
                    color="warning" 
                    variant="outlined"
                    sx={{ mt: 1, height: 24 }}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

// Add a CollapsibleContent component for progressive disclosure
const CollapsibleContent: React.FC<{
  title: string;
  initiallyExpanded?: boolean;
  children: React.ReactNode;
  theme: Theme;
}> = ({ title, initiallyExpanded = false, children, theme }) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  
  return (
    <Box sx={{ mb: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        size="small"
        sx={{
          justifyContent: 'space-between',
          textTransform: 'none',
          fontWeight: 'normal',
          borderColor: alpha(theme.palette.primary.main, 0.3),
          mb: expanded ? 1 : 0
        }}
        onClick={() => setExpanded(!expanded)}
        startIcon={expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
        endIcon={<MoreHorizIcon fontSize="small" />}
      >
        {title}
      </Button>
      <Collapse in={expanded}>
        <Box 
          sx={{ 
            ml: 3, 
            pl: 2,
            borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            pt: 1
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

// Update the renderBlockContent function to process highlighted key terms
const processKeyTerms = (
  text: string, 
  keyTerms: KeyTerm[],
  theme: Theme
) => {
  if (!keyTerms || keyTerms.length === 0 || typeof text !== 'string') {
    return text;
  }
  
  // Sort terms by length (longest first) to handle overlapping terms correctly
  const sortedTerms = [...keyTerms].sort((a, b) => b.term.length - a.term.length);
  
  // Create a map to store all term occurrences with their positions
  const termPositions: {start: number; end: number; term: string; definition: string}[] = [];
  
  // Find all term positions in the text
  sortedTerms.forEach(({ term, definition }) => {
    // Use word boundary to ensure we're matching whole words
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Check if this position overlaps with any existing position
      const start = match.index;
      const end = start + match[0].length;
      
      // Only add if this position doesn't overlap with any existing position
      const overlapping = termPositions.some(
        pos => (start >= pos.start && start < pos.end) || (end > pos.start && end <= pos.end)
      );
      
      if (!overlapping) {
        termPositions.push({ start, end, term: match[0], definition });
      }
    }
  });
  
  // Sort positions by start index
  termPositions.sort((a, b) => a.start - b.start);
  
  // Build result by concatenating text segments and highlighted terms
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  
  termPositions.forEach(({ start, end, term, definition }) => {
    // Add text before the term
    if (start > lastIndex) {
      result.push(text.substring(lastIndex, start));
    }
    
    // Add the highlighted term
    result.push(
      <Tooltip key={start} title={definition} arrow placement="top">
        <Box
          component="span"
          sx={{
            borderBottom: `2px dotted ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            fontWeight: 500,
            cursor: 'help',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          {term}
        </Box>
      </Tooltip>
    );
    
    lastIndex = end;
  });
  
  // Add remaining text after the last term
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }
  
  return <>{result}</>;
};

export default TeachingConcept; 