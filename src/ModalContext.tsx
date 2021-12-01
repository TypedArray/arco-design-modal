import { ButtonProps, Modal as ArcoModal } from '@arco-design/web-react';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Flag } from './Flag';
import { FlagButton } from './FlagButton';
import { ModalComponentProps } from './ModalComponentProps';
import { ModalProps } from './ModalProps';
import { shakeX } from './shakeX';

const ModalContext = React.createContext<Pick<
  ModalComponentProps,
  'close'
> | null>(null);
const { Consumer: ModalConsumer, Provider } = ModalContext;

export interface Props extends ModalProps {
  /**
   * 关闭弹窗的回调
   */
  onResolve?: ((flag: Flag) => void) | null;
  onExited?: ((flag: Flag) => void) | null;
}

/**
 * 弹框 Provider
 */
const ModalProvider = forwardRef<ModalComponentProps, Props>(function (
  {
    title,
    icon,
    content,
    children,
    flags = Flag.OK,
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
  const flagRef = useRef<Flag>();
  const [visible, setVisible] = useState<boolean>(true);
  const [loadingFlag, setLoadingFlag] = useState(Flag.NONE);
  const onFlag = useCallback(
    async (flag: Flag) => {
      setLoadingFlag(flag);
      if (typeof onClose === 'function') {
        const pFlag = await onClose(flag);
        // 如果返回了新的 pFlag 那就使用新的
        if (typeof pFlag === 'number') {
          flag = pFlag;
        }
      }
      if (flag & Flag.REJECT) {
        setLoadingFlag(Flag.NONE);
        // 拒绝后播放 shakeX 动画
        const dialog = containerRef.current?.querySelector('.arco-modal');
        await shakeX(dialog);
      } else {
        if (flag & 0xffffff) {
          await onResolve?.(flag);
          flagRef.current = flag;
          setVisible(false);
        }
        setLoadingFlag(Flag.NONE);
      }
    },
    [onClose, onResolve, setVisible, setLoadingFlag]
  );

  // 允许 Context 关闭弹窗
  const modalComponentProps = useMemo(
    () => ({
      close: (flag: Flag = Flag.CANCEL) => onFlag(flag),
    }),
    [onFlag]
  );
  // 允许 ref 关闭弹窗
  useImperativeHandle(ref, () => modalComponentProps, [modalComponentProps]);

  const closable = useMemo(
    () =>
      Array.isArray(flags)
        ? flags.includes(Flag.CLOSE)
        : Boolean(flags & Flag.CLOSE),
    [flags]
  );
  // 按钮排序
  const orderedFlags = useMemo(
    () =>
      Array.isArray(flags)
        ? flags
        : [Flag.CANCEL, Flag.OK, Flag.NO, Flag.YES].filter(
            (flag) => flags & flag
          ),
    [flags]
  );

  const buttonPropsCache = useMemo(
    () =>
      new Map<Flag, Omit<ButtonProps, 'onClick'>>([
        [
          Flag.OK,
          Object.assign({ children: okLabel, type: 'primary' }, okProps),
        ],
        [Flag.CANCEL, Object.assign({ children: cancelLabel }, cancelProps)],
        [Flag.YES, Object.assign({ children: yesLabel }, yesProps)],
        [Flag.NO, Object.assign({ children: noLabel }, noProps)],
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
  const buttons = useMemo(
    () =>
      orderedFlags.map((flag) => {
        const buttonProps = buttonPropsCache.get(flag);
        return (
          <FlagButton
            key={flag}
            {...buttonProps}
            flag={flag}
            onFlag={onFlag}
            loading={Boolean(loadingFlag & flag)}
          />
        );
      }),
    [loadingFlag, orderedFlags, buttonPropsCache]
  );

  const onModalClose = useCallback(() => onFlag(Flag.CLOSE), [onFlag]);
  const onModalExited = useCallback(async () => onExited?.(flagRef.current!), [
    onExited,
  ]);

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
        footer={buttons}
        visible={visible}
        closable={closable}
        maskClosable={maskClosable}
        onCancel={onModalClose}
        afterClose={onModalExited}
      >
        {content ?? children}
      </ArcoModal>
    </Provider>
  );
});

export { ModalContext, ModalConsumer, ModalProvider };
