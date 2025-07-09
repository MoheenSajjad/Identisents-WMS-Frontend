import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`rounded-lg bg-white p-4 shadow-xl ${className}`}>{children}</div>;
};

export default Card;
