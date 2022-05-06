import { MutableRefObject } from 'react';
import { ModalFlag } from './ModalFlag';

export interface ModalContextProps<T = any> {
  /**
   * 关闭弹窗
   * @param flag
   */
  close(flag?: ModalFlag): PromiseLike<void>;

  readonly forwardedRef: MutableRefObject<T>;
}
