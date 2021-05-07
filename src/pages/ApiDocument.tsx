import React from "react";
import { Table, Breadcrumb, Typography, Card, Spin } from "antd";

import { Params } from "../common/type";
import { getQueryParams } from "../common/utils";
const { Title, Paragraph, Text } = Typography;

function parseChildren(data: Array<Params>, key: string) {
  for (let val of data) {
    // 删除空的children，避免出现无效的 +
    if (val.children && val.children.length === 0) {
      delete val.children;
    } else if (val.children) {
      val.children = parseChildren(val.children, key);
    }
    // 指定key
    if (key) val.key = val[key];
  }
  return data;
}
function SceneMsg({ sceneMsg }: { sceneMsg: Array<Params> }): JSX.Element {
  const columns = [
    {
      title: "场景",
      dataIndex: "sceneName",
    },
    {
      title: "正式环境",
      dataIndex: "officialHref",
    },
    {
      title: "测试环境",
      dataIndex: "testHref",
    },
  ];
  return (
    <>
      <Title>场景概要</Title>
      <Table
        pagination={{ hideOnSinglePage: true }}
        columns={columns}
        dataSource={parseChildren(sceneMsg, "sceneName")}
      />
    </>
  );
}
function ApiMsg({ apiMsg }: { apiMsg: Array<Params> }): JSX.Element {
  return (
    <>
      <Title>API概要</Title>
      {apiMsg.map((val: Params, idx: number) => {
        return (
          <Paragraph key={idx}>
            <Text strong={false}>{val.text}:</Text>
            <Text> {val.value}</Text>
          </Paragraph>
        );
      })}
    </>
  );
}

function RequestDemo({ requestDemo }: { requestDemo: string }): JSX.Element {
  return (
    <>
      <Title>请求Demo</Title>
      <Card style={{ whiteSpace: "pre-wrap" }}>{requestDemo}</Card>
    </>
  );
}
function ResponseDemo({ responseDemo }: { responseDemo: string }): JSX.Element {
  return (
    <>
      <Title>响应Demo</Title>
      <Card style={{ whiteSpace: "pre-wrap" }}>{responseDemo}</Card>
    </>
  );
}
function CheckSignDemo({
  checkSignDemo,
}: {
  checkSignDemo: string;
}): JSX.Element {
  return (
    <>
      <Title>验签demo</Title>
      <Card style={{ whiteSpace: "pre-wrap" }}>{checkSignDemo}</Card>
    </>
  );
}
function EnterParameter({
  enterParameter,
}: {
  enterParameter: Array<Params>;
}): JSX.Element {
  const columns = [
    {
      title: "参数名",
      dataIndex: "paramName",
      key: "paramName",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "必须",
      dataIndex: "need",
      key: "need",
    },
    {
      title: "描述",
      dataIndex: "paramDes",
      key: "paramDes",
    },
  ];
  const queryParams = enterParameter.filter((val) => val.httpType === 3);
  const bodyParams = enterParameter.filter((val) => val.httpType !== 3);
  return (
    <>
      {queryParams.length > 0 && (
        <>
          <Title>URL请求参数</Title>
          <Table
            pagination={{ hideOnSinglePage: true }}
            columns={columns}
            dataSource={parseChildren(queryParams, "paramId")}
          />
        </>
      )}
      <>
        <Title>Body请求参数</Title>
        <Table
          pagination={{ hideOnSinglePage: true }}
          columns={columns}
          dataSource={parseChildren(bodyParams, "paramId")}
        />
      </>
    </>
  );
}
function OuterParameter({
  outerParameter,
}: {
  outerParameter: Array<Params>;
}): JSX.Element {
  const columns = [
    {
      title: "名称",
      dataIndex: "paramName",
      key: "paramName",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "描述",
      dataIndex: "paramDes",
      key: "paramDes",
    },
  ];
  return (
    <>
      <Title>响应参数</Title>
      <Table
        pagination={{ hideOnSinglePage: true }}
        columns={columns}
        dataSource={parseChildren(outerParameter, "paramId")}
      />
    </>
  );
}

function OutParams({ outParams }: { outParams: Array<Params> }): JSX.Element {
  const columns = [
    {
      title: "错误码",
      dataIndex: "code",
    },
    {
      title: "错误信息",
      dataIndex: "msg",
    },
    {
      title: "说明",
      dataIndex: "des",
    },
  ];
  return (
    <>
      <Title>错误码说明</Title>
      <Table
        pagination={{ hideOnSinglePage: true }}
        columns={columns}
        dataSource={parseChildren(outParams, "code")}
      />
    </>
  );
}
function ApiDocument() {
  type DocumentSchema = {
    sceneMsg: Array<Params>;
    apiMsg: Array<Params>;
    requestDemo: string;
    responseDemo: string;
    checkSignDemo: string;
    enterParameter: {
      list: Array<Params>;
    };
    outerParameter: {
      list: Array<Params>;
    };
    outParams: {
      errorCode: Array<Params>;
    };
  };
  const { scene_id, api_id } = getQueryParams() as {
    scene_id: string;
    api_id: string;
  };
  const initDocument: DocumentSchema = {
    sceneMsg: [],
    apiMsg: [],
    requestDemo: "",
    responseDemo: "",
    checkSignDemo: "",
    enterParameter: {
      list: [],
    },
    outerParameter: {
      list: [],
    },
    outParams: {
      errorCode: [],
    },
  };
  const [data, setData] = React.useState<DocumentSchema>(initDocument);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getData = () => {
      if (!scene_id || !api_id) {
        return;
      }
      fetch(`./data/${scene_id}/${api_id}.json`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setData(data.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Fetch Error:", error);
        });
    };
    getData();
  }, [scene_id, api_id]);
  if (!scene_id || !api_id) {
    return <Text type="danger">缺少必填参数</Text>;
  }
  if (loading) {
    return (
      <Spin tip="Loading...">
        <Text type="warning">请稍后，正在获取数据中...</Text>
      </Spin>
    );
  }
  const sceneMsg = data.sceneMsg;
  const apiMsg = data.apiMsg;
  const requestDemo = data.requestDemo;
  const responseDemo = data.responseDemo;
  const checkSignDemo = data.checkSignDemo;
  const enterParameter = data.enterParameter.list;
  const outerParameter = data.outerParameter.list;
  const outParams = data.outParams.errorCode;
  return (
    <>
      <Breadcrumb separator=">">
        <Breadcrumb.Item href="/scene">场景列表</Breadcrumb.Item>
        <Breadcrumb.Item href={`/api?scene_id=${scene_id}`}>
          API列表
        </Breadcrumb.Item>
        <Breadcrumb.Item>文档</Breadcrumb.Item>
      </Breadcrumb>
      <SceneMsg sceneMsg={sceneMsg} />
      <ApiMsg apiMsg={apiMsg} />
      <RequestDemo requestDemo={requestDemo} />
      <ResponseDemo responseDemo={responseDemo} />
      <CheckSignDemo checkSignDemo={checkSignDemo} />
      <EnterParameter enterParameter={enterParameter} />
      <OuterParameter outerParameter={outerParameter} />
      <OutParams outParams={outParams} />
    </>
  );
}

export default ApiDocument;
