import * as React from 'react';

export const useToggle = (defaultToggle = false) => {
  const [isToggled, setIsToggled] = React.useState<boolean>(defaultToggle);

  const toggleOn = React.useCallback((): void => {
    setIsToggled(true);
  }, []);

  const toggleOff = React.useCallback((): void => {
    setIsToggled(false);
  }, []);

  const toggle = React.useCallback((): void => {
    setIsToggled(isToggle => !isToggle);
  }, []);

  return {
    isToggled,
    toggleOn,
    toggleOff,
    toggle,
  };
};
