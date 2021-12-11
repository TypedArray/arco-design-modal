import {
  ButtonProps,
  ModalProps as ArcoModalProps,
} from '@arco-design/web-react';
import { ReactNode } from 'react';
import { ModalFlag } from './ModalFlag';

export interface ModalProps
  extends Omit<
    ArcoModalProps,
    'footer' | 'visible' | 'closable' | 'onOk' | 'onConfirm' | 'onCancel'
  > {
  /** Modal Title Icon */
  icon?: ReactNode;
  /** ModalMessage description */
  content?: ReactNode;
  children?: ReactNode;
  /** 需要展示哪些按钮 */
  flags?: ModalFlag | ModalFlag[];
  yesLabel?: string;
  noLabel?: string;
  okLabel?: string;
  cancelLabel?: string;
  yesProps?: Omit<ButtonProps, 'onClick'>;
  noProps?: Omit<ButtonProps, 'onClick'>;
  okProps?: Omit<ButtonProps, 'onClick'>;
  cancelProps?: Omit<ButtonProps, 'onClick'>;
  /**
   * 点选确认/取消/是/否按钮时触发，可以返回新的 flag
   */
  onClose?: (
    flag: ModalFlag
  ) => ModalFlag | void | PromiseLike<ModalFlag | void>;
}
