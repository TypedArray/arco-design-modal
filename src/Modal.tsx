import {
  IconCheckCircleFill,
  IconCloseCircleFill,
  IconExclamationCircleFill,
  IconInfoCircleFill,
} from '@arco-design/web-react/icon';
import React, {
  forwardRef,
  FunctionComponentElement,
  ReactNode,
  RefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ModalComponentProps } from './ModalComponentProps';
import { ModalProvider, ModalProviderProps } from './ModalContext';
import { ModalFlag } from './ModalFlag';
import { ModalProps } from './ModalProps';

interface ModalRefProps {
  ref?: RefObject<ModalComponentProps>;
}
interface Modal {
  show(
    props: ModalProps & ModalRefProps,
    children?: ReactNode
  ): Promise<ModalFlag>;
  size: number;
  clear(): void;
  confirm(
    props: ModalProps & ModalRefProps,
    children?: ReactNode
  ): Promise<ModalFlag>;
  info(
    props: ModalProps & ModalRefProps,
    children?: ReactNode
  ): Promise<ModalFlag>;
  success(
    props: ModalProps & ModalRefProps,
    children?: ReactNode
  ): Promise<ModalFlag>;
  warning(
    props: ModalProps & ModalRefProps,
    children?: ReactNode
  ): Promise<ModalFlag>;
  error(
    props: ModalProps & ModalRefProps,
    children?: ReactNode
  ): Promise<ModalFlag>;
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
    const [elements, setElements] = useState<
      FunctionComponentElement<ModalProviderProps>[]
    >([]);
    const internalShow = useCallback(
      (
        modalProps: ModalProps & ModalRefProps,
        children?: ReactNode
      ): Promise<ModalFlag> => {
        return new Promise<ModalFlag>((resolve) => {
          const instance = (
            <ModalProvider
              key={keyRef.current++}
              {...props}
              {...modalProps}
              children={children ?? modalProps?.children ?? props?.children}
              onResolve={resolve}
              onExited={() => {
                setElements((elements) =>
                  elements.filter((element) => element !== instance)
                );
              }}
            />
          );
          setElements((elements) => elements.concat(instance));
        });
      },
      []
    );
    const clear = useCallback(() => {
      elements.forEach((element) => {
        element.props.onResolve?.(ModalFlag.CLOSE);
      });
      setElements([]);
    }, [elements]);
    const size = useMemo(() => elements.length, [elements]);
    useImperativeHandle(
      ref,
      () => {
        return {
          size,
          clear,
          show: (
            modalProps: ModalProps & ModalRefProps,
            children?: ReactNode
          ) =>
            internalShow(
              {
                flags: ModalFlag.OK | ModalFlag.CANCEL | ModalFlag.CLOSE,
                ...modalProps,
              },
              children
            ),
          confirm: (
            modalProps: ModalProps & ModalRefProps,
            children?: ReactNode
          ) =>
            internalShow(
              {
                flags: ModalFlag.OK | ModalFlag.CANCEL | ModalFlag.CLOSE,
                icon: <IconExclamationCircleFill />,
                simple: true,
                ...modalProps,
              },
              children
            ),
          info: (
            modalProps: ModalProps & ModalRefProps,
            children?: ReactNode
          ) =>
            internalShow(
              {
                flags: ModalFlag.OK,
                icon: <IconInfoCircleFill />,
                simple: true,
                ...modalProps,
              },
              children
            ),
          success: (
            modalProps: ModalProps & ModalRefProps,
            children?: ReactNode
          ) =>
            internalShow(
              {
                flags: ModalFlag.OK,
                icon: <IconCheckCircleFill />,
                simple: true,
                ...modalProps,
              },
              children
            ),
          warning: (
            modalProps: ModalProps & ModalRefProps,
            children?: ReactNode
          ) =>
            internalShow(
              {
                flags: ModalFlag.OK,
                icon: <IconExclamationCircleFill />,
                simple: true,
                ...modalProps,
              },
              children
            ),
          error: (
            modalProps: ModalProps & ModalRefProps,
            children?: ReactNode
          ) =>
            internalShow(
              {
                flags: ModalFlag.OK,
                icon: <IconCloseCircleFill />,
                simple: true,
                ...modalProps,
              },
              children
            ),
        };
      },
      [internalShow, clear, size]
    );
    return <>{elements}</>;
  }),
  {
    /**
     * 无任何选择
     */
    NONE: ModalFlag.NONE,
    /**
     * 无任何选择，阻止窗口关闭
     */
    PREVENT_DEFAULT: ModalFlag.PREVENT_DEFAULT,
    /**
     * 点击 '是'
     */
    YES: ModalFlag.YES,
    /**
     * 选择 '否'
     */
    NO: ModalFlag.NO,
    /**
     * 选择 '确定'
     */
    OK: ModalFlag.OK,
    /**
     * 选择 '取消'
     */
    CANCEL: ModalFlag.CANCEL,
    /**
     * 选择 '关闭'
     */
    CLOSE: ModalFlag.CLOSE,
    /**
     * 拒绝，会附带播放 shakeX 动画
     */
    REJECT: ModalFlag.REJECT,
  }
);
export { Modal };
