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

const ModalContext = React.createContext<Pick<
  ModalComponentProps,
  'close'
> | null>(null);
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
      yesLabel = '是',
      noLabel = '否',
      okLabel = '确定',
      cancelLabel = '取消',
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
    const flagRef = useRef<ModalFlag>();
    const [visible, setVisible] = useState<boolean>(true);
    const [loadingFlag, setLoadingFlag] = useState(ModalFlag.NONE);
    const onFlag = useCallback(
      async (flag: ModalFlag) => {
        setLoadingFlag(flag);
        if (typeof onClose === 'function') {
          const pFlag = await onClose(flag);
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
    // 按钮排序
    const orderedFlags = useMemo(
      () =>
        Array.isArray(flags)
          ? flags
          : [
              ModalFlag.CANCEL,
              ModalFlag.OK,
              ModalFlag.NO,
              ModalFlag.YES,
            ].filter((flag) => flags & flag),
      [flags]
    );

    const buttonPropsCache = useMemo(
      () =>
        new Map<ModalFlag, Omit<ButtonProps, 'onClick'>>([
          [
            ModalFlag.OK,
            Object.assign({ children: okLabel, type: 'primary' }, okProps),
          ],
          [
            ModalFlag.CANCEL,
            Object.assign({ children: cancelLabel }, cancelProps),
          ],
          [ModalFlag.YES, Object.assign({ children: yesLabel }, yesProps)],
          [ModalFlag.NO, Object.assign({ children: noLabel }, noProps)],
        ]),
      [
        okLabel,
        okProps,
        cancelLabel,
        cancelProps,
        yesLabel,
        yesProps,
        noLabel,
        noProps,
      ]
    );
    const buttons = useMemo(() => {
      const orderedElements = orderedFlags.map((flag) => {
        const buttonProps = buttonPropsCache.get(flag);
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
      if (direction === 'rtl') {
        orderedElements.reverse();
      }
      return orderedElements;
    }, [loadingFlag, orderedFlags, buttonPropsCache, direction]);

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
