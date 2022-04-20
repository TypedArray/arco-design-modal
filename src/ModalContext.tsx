import { ButtonProps, Modal as ArcoModal } from '@arco-design/web-react';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ModalComponentProps } from './ModalComponentProps';
import { ModalFlag } from './ModalFlag';
import { ModalFlagButton } from './ModalFlagButton';
import { ModalProps } from './ModalProps';
import { shakeX } from './shakeX';

const ModalContext = React.createContext<ModalComponentProps>(
  null as unknown as ModalComponentProps
);
const { Consumer: ModalConsumer, Provider } = ModalContext;

export interface ModalProviderProps extends ModalProps {
  /**
   * 关闭弹窗的回调
   */
  onResolve?: (flag: ModalFlag) => void;
  onExited?: (flag: ModalFlag) => void;
}

/**
 * 弹框 Provider
 */
const ModalProvider = forwardRef<ModalComponentProps, ModalProviderProps>(
  function (
    {
      title,
      icon,
      content,
      children,
      flags = ModalFlag.OK,
      direction = 'ltr',
      yesLabel = 'Yes',
      noLabel = 'No',
      okLabel = 'OK',
      cancelLabel = 'Cancel',
      yesProps,
      noProps,
      okProps,
      cancelProps,
      maskClosable = false,
      onClose,
      onResolve,
      onExited,
      ...remainingProps
    },
    ref
  ) {
    const containerRef = useRef<Element>();
    const forwardedRef = useRef<unknown>();
    const flagRef = useRef<ModalFlag>();
    const [visible, setVisible] = useState<boolean>(true);
    const [loadingFlag, setLoadingFlag] = useState(ModalFlag.NONE);
    const onFlag = useCallback(
      async (flag: ModalFlag) => {
        setLoadingFlag(flag);
        if (typeof onClose === 'function') {
          const pFlag = await onClose(flag, forwardedRef);
          // 如果返回了新的 pFlag 那就使用新的
          if (typeof pFlag === 'number') {
            flag = pFlag;
          }
        }
        if (flag & ModalFlag.REJECT) {
          setLoadingFlag(ModalFlag.NONE);
          // 拒绝后播放 shakeX 动画
          const dialog = containerRef.current?.querySelector('.arco-modal');
          await shakeX(dialog);
        } else {
          if (flag & 0xffffff) {
            await onResolve?.(flag);
            flagRef.current = flag;
            setVisible(false);
          }
          setLoadingFlag(ModalFlag.NONE);
        }
      },
      [onClose, onResolve, setVisible, setLoadingFlag]
    );

    // 允许 Context 关闭弹窗
    const modalComponentProps = useMemo(
      () => ({
        close: (flag: ModalFlag = ModalFlag.CLOSE) => onFlag(flag),
        forwardedRef,
      }),
      [onFlag]
    );
    // 允许 ref 关闭弹窗
    useImperativeHandle(ref, () => modalComponentProps, [modalComponentProps]);

    const closable = useMemo(
      () =>
        Array.isArray(flags)
          ? flags.includes(ModalFlag.CLOSE)
          : Boolean(flags & ModalFlag.CLOSE),
      [flags]
    );
    const buttons = useMemo(() => {
      const buttonPropsMap = new Map<ModalFlag, Omit<ButtonProps, 'onClick'>>([
        [ModalFlag.YES, Object.assign({ children: yesLabel }, yesProps)],
        [ModalFlag.NO, Object.assign({ children: noLabel }, noProps)],
        [
          ModalFlag.OK,
          Object.assign({ children: okLabel, type: 'primary' }, okProps),
        ],
        [
          ModalFlag.CANCEL,
          Object.assign({ children: cancelLabel }, cancelProps),
        ],
      ]);
      // 按钮排序
      const orderedFlags = Array.isArray(flags)
        ? flags
        : [ModalFlag.YES, ModalFlag.NO, ModalFlag.OK, ModalFlag.CANCEL].filter(
            (flag) => flags & flag
          );
      const orderedElements = orderedFlags.map((flag) => {
        const buttonProps = buttonPropsMap.get(flag);
        return (
          <ModalFlagButton
            key={flag}
            {...buttonProps}
            flag={flag}
            onFlag={onFlag}
            loading={Boolean(loadingFlag & flag)}
          />
        );
      });
      // 展示方向
      if (direction === 'rtl') {
        orderedElements.reverse();
      }
      return orderedElements;
    }, [
      okLabel,
      okProps,
      cancelLabel,
      cancelProps,
      yesLabel,
      yesProps,
      noLabel,
      noProps,
      loadingFlag,
      flags,
      direction,
      onFlag,
    ]);

    const onModalClose = useCallback(() => onFlag(ModalFlag.CLOSE), [onFlag]);
    const onModalExited = useCallback(
      async () => onExited?.(flagRef.current!),
      [onExited]
    );

    return (
      <Provider value={modalComponentProps}>
        <ArcoModal
          {...remainingProps}
          // @ts-ignore
          ref={containerRef}
          title={
            <span>
              {icon}
              {title}
            </span>
          }
          footer={buttons.length > 0 ? buttons : null}
          visible={visible}
          closable={closable}
          maskClosable={maskClosable}
          onCancel={onModalClose}
          afterClose={onModalExited}
        >
          {content}
          {children}
        </ArcoModal>
      </Provider>
    );
  }
);

export { ModalContext, ModalConsumer, ModalProvider };
