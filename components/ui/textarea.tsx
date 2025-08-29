import React from 'react';
import './textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        className={`textarea ${className}`.trim()}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };