import React from "react";
import { Table, Typography, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { getQueryParams } from "../common/utils";

const { Text } = Typography;

const ApiList = function () {
  const columns = [
    {
      title: "API接口名称",
      dataIndex: "name",
      render: (val, record) => {
        return (
          <Link to={`/document?scene_id=${scene_id}&api_id=${record.id}`}>
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

  const { scene_id } = getQueryParams();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getData = () => {
      if (!scene_id) {
        return;
      }
      fetch(`./data/api_list_${scene_id}.json`, {
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
        <Breadcrumb.Item href="/scene">场景列表</Breadcrumb.Item>
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
