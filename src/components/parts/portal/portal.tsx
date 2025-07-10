import * as React from 'react';
import { JSX } from 'react';
import ReactDOM from 'react-dom';

type PortalProps = {
  rootId: string;
  children?: React.ReactNode;
};

export const Portal = ({ rootId, children }: PortalProps): JSX.Element | null => {
  const rootElement: HTMLElement | null = document.getElementById(rootId);
  if (!rootElement) {
    return null;
  }

  return <React.Fragment>{ReactDOM.createPortal(children, rootElement)}</React.Fragment>;
};
