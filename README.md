# 渲染奇门文档

## 背景

在 奇门(qimen.taobao.com) 配置场景API后，需要提供文档给外部开发人员。但奇门对外部只能提供SDK，无法导出文档，存在外部人员不使用 taobao SDK 的情况，因此本项目孕育而生。

## 概述

- 1.项目通过 [create-react-app-antd](https://github.com/ant-design/create-react-app-antd) 脚手架搭建
- 2.需要登录 qimen.taobao.com 提供 Cookie 中 `_tb_token_`、`cookie2` 的值进行下载文档原始数据

## 本地启动

- 1.通过脚本下载文档原始数据

```bash
export QIMEN_DOWNLOAD_TOKEN="xxx" && export QIMEN_DOWNLOAD_COOKIE="xxx"
python deploy/download.py
```

- 2.启动项目

```bash
npm install
npm start
```

or:

```bash
yarn
yarn start
```

## docker-compose 启动

```bash
export QIMEN_DOWNLOAD_TOKEN="xxx" && export QIMEN_DOWNLOAD_COOKIE="xxx"
bash deploy/dco.sh build
bash deploy/dco.sh up -d --force-recreate
```
