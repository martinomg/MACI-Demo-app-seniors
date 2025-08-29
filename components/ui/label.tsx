import React from 'react';
import './label.css';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => (
    <label
      ref={ref}
      className={`label ${className}`.trim()}
      {...props}
    />
  )
);

Label.displayName = 'Label';

export { Label };