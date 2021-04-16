import React from "react";
import { Table, Typography } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;

const SceneList = function () {
  type SceneSchema = {
    id: number;
    name: string;
    domin_name: string;
  };
  const columns = [
    {
      title: "场景名称",
      dataIndex: "name",
      render: (val: string, record: SceneSchema) => {
        return <Link to={`/api?scene_id=${record.id}`}>{val}</Link>;
      },
    },
    {
      title: "域名",
      dataIndex: "domin_name",
    },
  ];

  const [data, setData] = React.useState<Array<SceneSchema>>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getData = () => {
      fetch("./data/scene_list.json", {
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
  }, []);
  return (
    <>
      <Title>奇门接口文档</Title>

      <Table
        pagination={{ hideOnSinglePage: true }}
        columns={columns}
        dataSource={data}
        loading={loading}
      />
    </>
  );
};

export default SceneList;
