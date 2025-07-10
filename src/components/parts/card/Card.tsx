import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`rounded-xl bg-white px-8 py-10 shadow-xl ${className}`}>{children}</div>;
};

export default Card;
