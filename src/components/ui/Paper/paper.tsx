import * as React from 'react';
import { JSX } from 'react';

import { clsx } from '@/utils/clsx';

type PaperProps = {
  className?: string;
  header?: React.ReactNode;
  children?: React.ReactNode;
};

type PaperComponent = {
  (props: PaperProps): JSX.Element;
  Title: typeof PaperTitle;
  BigTitle: typeof PaperBigTitle;
};

export const Paper: PaperComponent = ({ className, header, children }: PaperProps): JSX.Element => {
  const rootCls = clsx(['bg-gray-100 rounded', className]);

  return (
    <div className={rootCls}>
      {header && <div className="border-b border-gray-200 p-8">{header}</div>}
      <div className="p-8">{children}</div>
    </div>
  );
};

type PaperBigTitle = {
  title: string;
  children?: React.ReactNode;
};

export const PaperBigTitle = ({ title, children }: PaperBigTitle): JSX.Element => {
  return (
    <div className="mb-6 flex items-center justify-between text-xl font-semibold text-gray-800 first:mt-0 [&:not(:first-child)]:mt-8">
      <div>{title}</div>
      {children && children}
    </div>
  );
};

type PaperTitleProps = {
  title: string;
};

export const PaperTitle = ({ title }: PaperTitleProps): JSX.Element => {
  return (
    <div className="mb-8 flex w-full items-center first:mt-0 [&:not(:first-child)]:mt-8">
      <div className="mr-4 flex-shrink-0 text-base font-semibold text-gray-800 uppercase">
        {title}
      </div>
      <div className="flex-grow border-b border-gray-200"></div>
    </div>
  );
};

Paper.Title = PaperTitle;
Paper.BigTitle = PaperBigTitle;
