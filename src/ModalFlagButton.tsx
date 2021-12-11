import { Button, ButtonProps } from '@arco-design/web-react';
import React, { useCallback } from 'react';
import { ModalFlag } from './ModalFlag';

interface Props extends Omit<ButtonProps, 'onClick'> {
  onFlag: (flag: ModalFlag) => void;
  flag: ModalFlag;
}

function ModalFlagButton({ flag, onFlag, ...props }: Props) {
  const onClick = useCallback(() => {
    onFlag(flag);
  }, [flag, onFlag]);
  return <Button {...props} onClick={onClick} />;
}

export { ModalFlagButton };
