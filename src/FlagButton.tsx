import { Button, ButtonProps } from '@arco-design/web-react';
import React, { useCallback } from 'react';
import { Flag } from './Flag';

interface Props extends Omit<ButtonProps, 'onClick'> {
  onFlag: (flag: Flag) => void;
  flag: Flag;
}

function FlagButton({ flag, onFlag, ...props }: Props) {
  const onClick = useCallback(() => {
    onFlag(flag);
  }, [flag, onFlag]);
  return <Button {...props} onClick={onClick} />;
}

export { FlagButton };
