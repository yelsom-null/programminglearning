declare module 'framer-motion' {
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    whileFocus?: any;
    whileDrag?: any;
    variants?: any;
  }
  
  export const motion: {
    div: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & MotionProps>;
    span: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLSpanElement> & MotionProps>;
    [key: string]: any;
  };
} 