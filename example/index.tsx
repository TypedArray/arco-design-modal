import { Button } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import Modal from '../dist';

const App = () => {
  const modalRef = useRef<Modal>(null);
  const onClick = async () =>
    await modalRef.current?.info({
      title: '路由表更新成功！',
      content: '配置将在 1-3 分钟内同步到集群中的路由节点',
    });
  return (
    <>
      <Button onClick={onClick} type="primary">
        info
      </Button>
      <Modal ref={modalRef} />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
