
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-neutral-700 rounded-lg shadow-lg p-6 transition-all hover:shadow-xl dark:shadow-none dark:border dark:border-neutral-600 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
