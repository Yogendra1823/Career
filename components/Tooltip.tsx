import React, { ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block group">
      {children}
      <div 
        className={`absolute ${positionClasses[position]} w-max max-w-xs bg-neutral text-white text-xs rounded-md py-1 px-2 z-10 
                   invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
