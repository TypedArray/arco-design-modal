import { MutableRefObject } from 'react';
import { ModalFlag } from './ModalFlag';

export interface ModalComponentProps {
  /**
   * 关闭弹窗
   * @param flag
   */
  close(flag?: ModalFlag): PromiseLike<void>;

  readonly innerRef: MutableRefObject<unknown>;
}
