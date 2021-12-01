import { Flag } from './Flag';

export interface ModalComponentProps {
  /**
   * 关闭弹窗
   * @param flag
   */
  close(flag?: Flag): Promise<void>;
}
