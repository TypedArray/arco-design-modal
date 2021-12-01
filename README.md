# @typedarray/arco-design-modal

基于 `@arco-design/web-react` [Modal](https://arco.design/react/components/modal) 的弹窗管理器，支持 [React Context](https://reactjs.org/docs/context.html)

```jsx
const modalRef = useRef<Modal>();

const flag = await modalRef.current?.confirm({
  title: '标题',
  content: '内容',
  flags: Modal.OK | Modal.CANCEL | Modal.YES | Modal.NO | Modal.CLOSE
});
if (flag & Modal.OK) {
  console.log('你点击了‘确定’');
}

<Modal ref={modalRef} />;
```

# Install 安装

Available as an npm package [@typedarray/arco-design-modal](https://www.npmjs.com/package/@typedarray/arco-design-modal)

```sh
// with npm
npm install @typedarray/arco-design-modal

// with yarn
yarn add @typedarray/arco-design-modal
```

## Usage 使用方法

```jsx
import Modal from '@typedarray/arco-design-modal';

const modalRef = useRef<Modal>();

const flag = await modalRef.current?.confirm({
  title: '标题',
  content: '内容'
});
if (flag & Modal.OK) {
  console.log('你点击了‘确定’');
}

<Modal ref={modalRef} />;
```

## Features 功能

1. 支持 [Context](https://reactjs.org/docs/context.html)

[通过方法去使用对话框](https://arco.design/react/components/modal)，像是 `Modal.confirm` `Modal.warning`，因为是通过 `ReactDOM.render` 直接渲染，所以不在上下文中，因此拿不到 `Context`。  
如果希望获取上下文 `Context`，那么可以将 `<Modal ref={modalRef}/>` 放到上下文中，通过 `useRef` 调用。

2. 自定义最多 `5` 个按钮（`确定` / `取消` / `是` / `否` / `关闭`）

```jsx
modalRef.current?.confirm({
  title: '标题',
  content: '内容',
  flags: Modal.OK | Modal.CANCEL | Modal.YES | Modal.NO | Modal.CLOSE, // 需要显示的按钮
});
```

3. 自定义按钮排序

```jsx
modalRef.current?.confirm({
  title: '标题',
  content: '内容',
  flags: [Modal.YES, Modal.NO, Modal.OK, Modal.CANCEL, Modal.CLOSE], // 按钮按数组排序
});
```

4. 自动随父节点销毁，无需手动 `Modal.destroyAll`

5. 其他用法，支持 `show` `confirm` `info` `success` `warning` `error`

## Props 属性参数

- `icon` 标题前的图标
- `title` 标题
- `content` / `children` 弹窗内容
- `flags` 要展示的按钮 包括 `Modal.OK` `Modal.CANCEL` `Modal.YES` `Modal.NO` `Modal.CLOSE` 使用位或运算符 `|` 连接，或者数组
- `children` 属性可以单独作为第二个参数
- 其他属性参考 `@arco-design/web-react` [Modal 组件](https://arco.design/react/components/modal)
