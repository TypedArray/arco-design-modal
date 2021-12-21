import { Alert, Button, List, Space } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';
import { Meta } from '@storybook/react';
import React, { useCallback, useRef } from 'react';
import { Modal, ModalComponentProps } from '../src';

export const Default = () => {
  const modalRef = useRef<Modal>(null);
  const onShowClick = useCallback(async () => {
    await modalRef.current?.show({
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
    });
  }, []);
  const onConfirmClick = useCallback(async () => {
    await modalRef.current?.confirm({
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
    });
  }, []);
  const onInfoClick = useCallback(async () => {
    await modalRef.current?.info({
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
    });
  }, []);
  const onSuccessClick = useCallback(async () => {
    await modalRef.current?.success({
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
    });
  }, []);
  const onWarningClick = useCallback(async () => {
    await modalRef.current?.warning({
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
    });
  }, []);
  const onErrorClick = useCallback(async () => {
    await modalRef.current?.error({
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
    });
  }, []);
  return (
    <>
      <Space style={{ padding: 16 }}>
        <Button onClick={onShowClick}>show</Button>
        <Button onClick={onConfirmClick} status="warning">
          confirm
        </Button>
        <Button onClick={onSuccessClick} status="success">
          success
        </Button>
        <Button onClick={onInfoClick}>info</Button>
        <Button onClick={onWarningClick} status="warning">
          warning
        </Button>
        <Button onClick={onErrorClick} status="danger">
          error
        </Button>
      </Space>
      <Modal ref={modalRef} />
    </>
  );
};
export const Show = () => {
  const modalRef = useRef<Modal>(null);
  const innerRef = useRef<ModalComponentProps>(null);
  const onClick = useCallback(async () => {
    const flag = await modalRef.current?.show(
      {
        ref: innerRef,
        title: '标题',
        content: '内容',
        flags: Modal.OK | Modal.CANCEL | Modal.YES | Modal.NO | Modal.CLOSE, // 需要显示的按钮们
        onClose: async (flag) => {
          // 判断用户点击了哪个按钮
          if (flag & Modal.OK) {
            console.log('你点击了‘确定’');
          }
          if (flag & Modal.YES) {
            console.log('你点击了‘是’');
            return Modal.REJECT; // 阻止窗口关闭
          }
        },
      },
      <>
        <Alert
          type="warning"
          title={
            <>
              <>小程序云服务器有奖内测中，即刻成为产品体验官</>
              <>云服务器限时秒杀，首购1C1G仅需99元/年</>
              <>让企业普惠上云，云服务器最低至2.5折</>
            </>
          }
        />
        <Alert
          type="warning"
          content={
            <>
              <h4 style={{ marginBottom: 8 }}>重要声明</h4>
              <p>本功能将在 2019 年 2 月 29 日下线，请注意做好下列迁移工作：</p>
              <List>
                <List.Item>
                  小程序云服务器有奖内测中，即刻成为产品体验官
                </List.Item>
                <List.Item>
                  云服务器限时秒杀，首购1C1G仅需99元/年，还有多款配置供您选择
                </List.Item>
                <List.Item>
                  让企业普惠上云，云服务器最低至2.5折，还有更多产品更低折扣满足您的需求
                </List.Item>
              </List>
            </>
          }
        />
      </>
    );
    console.log(`最终窗口点击了哪个按钮（可能是被 onClose 更改的）${flag}`);
  }, []);
  return (
    <>
      <Button onClick={onClick}>自定义提示</Button>
      <Modal ref={modalRef} />
    </>
  );
};
export const Confirm = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = useCallback(async () => {
    const flag = await modalRef.current?.confirm({
      title: '确认删除当前所选实例？',
      content: '删除后，该实例下的所有配置将会被清空，且无法恢复。',
      okLabel: '删除',
      cancelLabel: '取消',
    });
    if (flag! & Modal.OK) {
      await modalRef.current?.success({
        title: '删除成功',
      });
    } else if (flag! & Modal.CANCEL) {
      await modalRef.current?.error({
        title: '删除失败',
      });
    }
  }, []);
  return (
    <>
      <Button onClick={onClick}>confirm</Button>
      <Modal ref={modalRef} />
    </>
  );
};
export const Info = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = useCallback(async () => {
    await modalRef.current?.info({
      title: '路由表更新成功！',
      content: '配置将在 1-3 分钟内同步到集群中的路由节点',
    });
  }, []);
  return (
    <>
      <Button onClick={onClick}>info</Button>
      <Modal ref={modalRef} />
    </>
  );
};
export const Success = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = useCallback(async () => {
    await modalRef.current?.success({
      title: '路由表更新成功！',
      content: '配置将在 1-3 分钟内同步到集群中的路由节点',
    });
  }, []);
  return (
    <>
      <Button onClick={onClick}>success</Button>
      <Modal ref={modalRef} />
    </>
  );
};
export const Warning = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = useCallback(async () => {
    await modalRef.current?.warning({
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
    });
  }, []);
  return (
    <>
      <Button onClick={onClick}>warning</Button>
      <Modal ref={modalRef} />
    </>
  );
};
export const Error = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = useCallback(async () => {
    await modalRef.current?.error({
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
    });
  }, []);
  return (
    <>
      <Button onClick={onClick}>error</Button>
      <Modal ref={modalRef} />
    </>
  );
};
export const Clear = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = useCallback(async () => {
    modalRef.current?.show({
      simple: true,
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
      flags: [Modal.YES, Modal.NO, Modal.OK, Modal.CANCEL],
    });
    modalRef.current?.show({
      simple: true,
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
      flags: [Modal.YES, Modal.NO, Modal.OK, Modal.CANCEL],
    });
    modalRef.current?.show({
      simple: true,
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
      flags: [Modal.YES, Modal.NO, Modal.OK, Modal.CANCEL],
      onClose: () => {
        modalRef.current?.clear();
      },
    });
  }, []);
  return (
    <>
      <Button onClick={onClick}>Show</Button>

      <Modal ref={modalRef} />
    </>
  );
};
export const NoFlags = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = useCallback(async () => {
    modalRef.current?.show({
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
      flags: Modal.CLOSE,
    });
  }, []);
  return (
    <>
      <Button onClick={onClick}>NoFlags</Button>
      <Modal ref={modalRef} />
    </>
  );
};
export const OrderedFlags = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = useCallback(async () => {
    await modalRef.current?.show({
      simple: true,
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
      flags: [Modal.YES, Modal.NO, Modal.OK, Modal.CANCEL],
    });
  }, []);
  return (
    <>
      <Button onClick={onClick}>按钮排序</Button>
      <Modal ref={modalRef} />
    </>
  );
};

export const Direction = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = useCallback(async () => {
    await modalRef.current?.show({
      simple: true,
      title: '路由表更新失败！',
      content: '路由表包含无效的路由转发策略公网网关的网络',
      flags: [Modal.YES, Modal.NO, Modal.OK, Modal.CANCEL],
      direction: 'rtl',
    });
  }, []);
  return (
    <>
      <Button onClick={onClick}>按钮排序</Button>
      <Modal ref={modalRef} />
    </>
  );
};

const meta: Meta = {
  title: 'Modal',
};

export default meta;
