import {
  IconCheckCircleFill,
  IconCloseCircleFill,
  IconExclamationCircleFill,
  IconInfoCircleFill,
} from '@arco-design/web-react/icon';
import React, {
  forwardRef,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Flag } from './Flag';
import { ModalComponentProps } from './ModalComponentProps';
import { ModalProvider } from './ModalContext';
import { ModalProps } from './ModalProps';

interface ModalRefProps {
  ref?: RefObject<ModalComponentProps>;
}
interface Modal {
  show(props: ModalProps & ModalRefProps, children?: ReactNode): Promise<Flag>;

  confirm(
    props: ModalProps & ModalRefProps,
    children?: ReactNode
  ): Promise<Flag>;

  info(props: ModalProps & ModalRefProps, children?: ReactNode): Promise<Flag>;
  success(
    props: ModalProps & ModalRefProps,
    children?: ReactNode
  ): Promise<Flag>;
  warning(
    props: ModalProps & ModalRefProps,
    children?: ReactNode
  ): Promise<Flag>;
  error(props: ModalProps & ModalRefProps, children?: ReactNode): Promise<Flag>;
}

/**
 * 基于 `@arco-design/web-react` [Modal](https://arco.design/react/components/modal) 的弹窗管理器，支持 [React Context](https://reactjs.org/docs/context.html)
 *
 * ```jsx
 * const modalRef = useRef<Modal>();
 *
 * const flag = await modalRef.current?.confirm({
 *   title: '标题',
 *   content: '内容',
 *   flags: Modal.OK | Modal.CANCEL | Modal.YES | Modal.NO | Modal.CLOSE
 * });
 * if (flag & Modal.OK) {
 *   console.log('你点击了‘确定’');
 * }
 *
 * <Modal ref={modalRef} />;
 * ```
 */
const Modal = Object.assign(
  forwardRef<Modal, ModalProps>((props, ref) => {
    const keyRef = useRef(0);
    const [children, setChildren] = useState<ReactElement[]>([]);
    const show = useCallback(
      (
        modalProps?: ModalProps & ModalRefProps,
        children?: ReactNode
      ): Promise<Flag> => {
        return new Promise<Flag>((resolve) => {
          const instance = (
            <ModalProvider
              key={keyRef.current++}
              {...props}
              {...modalProps}
              ref={modalProps?.ref}
              onResolve={resolve}
              onExited={() => {
                setChildren((children) =>
                  children.filter((child) => child !== instance)
                );
              }}
            >
              {children ?? modalProps?.children ?? props?.children}
            </ModalProvider>
          );
          setChildren((children) => children.concat(instance));
        });
      },
      [setChildren]
    );
    useImperativeHandle(
      ref,
      () => {
        return {
          show,
          confirm: (modalProps: ModalProps & ModalRefProps) =>
            show({
              flags: Flag.OK | Flag.CANCEL | Flag.CLOSE,
              icon: <IconExclamationCircleFill />,
              simple: true,
              ...modalProps,
            }),
          info: (modalProps: ModalProps & ModalRefProps) =>
            show({
              flags: Flag.OK | Flag.CANCEL | Flag.CLOSE,
              icon: <IconInfoCircleFill />,
              simple: true,
              ...modalProps,
            }),
          success: (modalProps: ModalProps & ModalRefProps) =>
            show({
              flags: Flag.OK,
              icon: <IconCheckCircleFill />,
              simple: true,
              ...modalProps,
            }),
          warning: (modalProps: ModalProps & ModalRefProps) =>
            show({
              flags: Flag.OK,
              icon: <IconExclamationCircleFill />,
              simple: true,
              ...modalProps,
            }),
          error: (modalProps: ModalProps & ModalRefProps) =>
            show({
              flags: Flag.OK,
              icon: <IconCloseCircleFill />,
              simple: true,
              ...modalProps,
            }),
        };
      },
      [show]
    );
    return <>{children}</>;
  }),
  {
    /**
     * 无任何选择
     */
    NONE: Flag.NONE,
    /**
     * 无任何选择，阻止窗口关闭
     */
    PREVENT_DEFAULT: Flag.PREVENT_DEFAULT,
    /**
     * 点击 '是'
     */
    YES: Flag.YES,
    /**
     * 选择 '否'
     */
    NO: Flag.NO,
    /**
     * 选择 '确定'
     */
    OK: Flag.OK,
    /**
     * 选择 '取消'
     */
    CANCEL: Flag.CANCEL,
    /**
     * 选择 '关闭'
     */
    CLOSE: Flag.CLOSE,
    /**
     * 拒绝，会附带播放 shakeX 动画
     */
    REJECT: Flag.REJECT,
  }
);
export { Modal };
