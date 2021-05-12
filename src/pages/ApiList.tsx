import React from "react";
import { Table, Typography, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { getQueryParams } from "../common/utils";
import { URL_PREFIX, ROUTES } from "../common/constants";

const { Text } = Typography;

const ApiList = function (): JSX.Element {
  type ListSchema = {
    id: number;
    name: string;
    description: string;
  };
  const columns = [
    {
      title: "API接口名称",
      dataIndex: "name",
      render: (val: string, record: ListSchema) => {
        return (
          <Link
            to={`${ROUTES.DOCUMENT}?scene_id=${scene_id}&api_id=${record.id}`}
          >
            {val}
          </Link>
        );
      },
    },
    {
      title: "API中文名称",
      dataIndex: "description",
    },
  ];

  const { scene_id } = getQueryParams() as {
    scene_id: string;
  };
  const [data, setData] = React.useState<Array<ListSchema>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getData = () => {
      if (!scene_id) {
        return;
      }
      fetch(`${URL_PREFIX}/data/api_list_${scene_id}.json`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Fetch Error:", error);
        });
    };
    getData();
  }, [scene_id]);

  return (
    <>
      <Breadcrumb separator=">">
        <Breadcrumb.Item href={ROUTES.SCENE}>场景列表</Breadcrumb.Item>
        <Breadcrumb.Item>API列表</Breadcrumb.Item>
      </Breadcrumb>
      {scene_id ? (
        <Table
          pagination={{ hideOnSinglePage: true }}
          columns={columns}
          dataSource={data}
          loading={loading}
        />
      ) : (
        <Text type="danger">缺少必填参数</Text>
      )}
    </>
  );
};

export default ApiList;
