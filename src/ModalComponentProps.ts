import { ModalFlag } from './ModalFlag';

export interface ModalComponentProps {
  /**
   * 关闭弹窗
   * @param flag
   */
  close(flag?: ModalFlag): PromiseLike<void>;
}
