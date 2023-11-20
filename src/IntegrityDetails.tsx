import React from "react";

import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Collapse,
  CollapseProps,
  Divider,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/es/table";

function IntegrityDetails() {
  interface DataType {
    key: React.Key;
    network: string;
    status: React.ReactNode;
    timestamp: number;
  }

  const columns: ColumnsType<DataType> = [
    { title: "Network", dataIndex: "network", key: "network" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Timestamp", dataIndex: "timestamp", key: "timestamp" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => <a>Delete</a>,
    },
  ];

  const data: DataType[] = [
    {
      key: 1,
      network: "John Brown",
      status: <Tag color="success">success</Tag>,
      timestamp: 100395,
    },
  ];

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Integrity details",
      children: (
        <div className="p-6">
          <Tooltip
            placement="leftTop"
            title="Digital Fingerprint of the document."
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp;Hash:
            </p>
          </Tooltip>
          <p className="text-gray-500 text-sm">ae0beb8e964....69b0b477943c</p>

          <Divider />
          <Tooltip
            placement="leftTop"
            title="Networks where document fingerprint was recorded"
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp; Networks:
            </p>
            <br />
            <Table
              columns={columns}
              expandable={{
                expandedRowRender: () => (
                  <p style={{ margin: 10 }}>
                    {
                      <div>
                        <Tooltip
                          placement="leftTop"
                          title="Unique address of a transaction in a
                          blockchain that acts as a or proof 
                          that the transaction has taken place"
                        >
                          <p className="font-bold">
                            <InfoCircleOutlined />
                            &nbsp;Transaction Hash:
                          </p>
                          <p className="text-gray-500 text-sm">
                            ae0beb8e964....69b0b477943c
                          </p>
                        </Tooltip>
                        <br />
                        <Tooltip
                          placement="leftTop"
                          title="Identifier of the BLOOCK state transition the document has been included in"
                        >
                          <p className="font-bold">
                            <InfoCircleOutlined />
                            &nbsp;Anchor ID:
                          </p>
                          <p className="text-gray-500 text-sm">60638</p>
                        </Tooltip>
                        <br />
                        <Tooltip
                          placement="leftTop"
                          title="Digital fingerprint representing all records included in BLOOCK state since inception"
                        >
                          <p className="font-bold">
                            <InfoCircleOutlined />
                            &nbsp;Root:
                          </p>
                          <p className="text-gray-500 text-sm">
                            ae0beb8e964....69b0b477943c
                          </p>
                        </Tooltip>
                      </div>
                    }
                  </p>
                ),
                rowExpandable: (record) => record.network !== "Not Expandable",
              }}
              dataSource={data}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      key: "2",
      label: "Authenticity details",
      children: (
        <div className="p-6">
          <Tooltip
            placement="leftTop"
            title="Digital Fingerprint of the document."
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp;Algorithm:
            </p>
          </Tooltip>
          <p className="text-gray-500 text-sm">ES256K_M </p>
          <Divider />

          <Tooltip
            placement="leftTop"
            title="Digital Fingerprint of the document."
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp;Signature:
            </p>
          </Tooltip>
          <p className="text-gray-500 text-sm">
            wzXO_qj76oa7zwjPC3e6teymAfzj5idkN-371_E8oGWEp4s8xEah75-4gG3OWPVG-EB36LejhcJ53zwcgs18Zg==
          </p>
          <Divider />
          <Tooltip
            placement="leftTop"
            title="Digital Fingerprint of the document."
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp;Key ID:
            </p>
          </Tooltip>
          <p className="text-gray-500 text-sm">
            c6539969d3cb-47f7b9a4-4ce9947151c8
          </p>
        </div>
      ),
    },
    {
      key: "3",
      label: "Access control details",
      children: (
        <div className="p-6">
          <Tooltip
            placement="leftTop"
            title="Digital Fingerprint of the document."
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp;Algorithm:
            </p>
          </Tooltip>
          <p className="text-gray-500 text-sm">ES256K_M </p>
          <Divider />

          <Tooltip
            placement="leftTop"
            title="Digital Fingerprint of the document."
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp;Signature:
            </p>
          </Tooltip>
          <p className="text-gray-500 text-sm">
            wzXO_qj76oa7zwjPC3e6teymAfzj5idkN-371_E8oGWEp4s8xEah75-4gG3OWPVG-EB36LejhcJ53zwcgs18Zg==
          </p>
          <Divider />
          <Tooltip
            placement="leftTop"
            title="Digital Fingerprint of the document."
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp;Key ID:
            </p>
          </Tooltip>
          <p className="text-gray-500 text-sm">
            c6539969d3cb-47f7b9a4-4ce9947151c8
          </p>
        </div>
      ),
    },
    {
      key: "4",
      label: "Availability details",
      children: (
        <div className="p-6">
          <Tooltip
            placement="leftTop"
            title="Digital Fingerprint of the document."
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp;Algorithm:
            </p>
          </Tooltip>
          <p className="text-gray-500 text-sm">ES256K_M </p>
          <Divider />

          <Tooltip
            placement="leftTop"
            title="Digital Fingerprint of the document."
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp;Signature:
            </p>
          </Tooltip>
          <p className="text-gray-500 text-sm">
            wzXO_qj76oa7zwjPC3e6teymAfzj5idkN-371_E8oGWEp4s8xEah75-4gG3OWPVG-EB36LejhcJ53zwcgs18Zg==
          </p>
          <Divider />
          <Tooltip
            placement="leftTop"
            title="Digital Fingerprint of the document."
          >
            <p className="font-bold">
              <InfoCircleOutlined />
              &nbsp;Key ID:
            </p>
          </Tooltip>
          <p className="text-gray-500 text-sm">
            c6539969d3cb-47f7b9a4-4ce9947151c8
          </p>
        </div>
      ),
    },
  ];

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return (
    <div>
      <div className=" p-4">
        <div className="text-center text-white text-custom-size font-montserrat p-4">
          <p>- IntegrityDetails -</p>
        </div>
        <div className="flex flex-wrap justify-center">
          <Card
            className=""
            style={{
              width: "1000px",
              minHeight: "500px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            bordered={false}
          >
            <div className="flex justify-left p-12">
              <div className="flex flex-col items-center mr-12">
                <img
                  alt="example"
                  src="https://cdn.pixabay.com/index/2023/11/17/03-16-14-750_1440x550.jpg"
                  className="w-38 h-48 object-cover object-center rounded-md"
                />
              </div>
              <div className="flex flex-col items-left flex-1">
                <Tag
                  icon={<CheckCircleOutlined />}
                  color="success"
                  className="pl-8 bg-gray-100 flex items-center text-sm"
                  style={{ width: "450px", height: "35px" }}
                >
                  Your document has been verified
                </Tag>
                <div className="p-4">
                  <p className="font-bold">Name</p>
                  <p className="text-gray-500 text-sm">Document.pdf</p>
                  <br />
                  <p className="font-bold">Issuer</p>
                  <p className="text-gray-500 text-sm">Harvard University</p>
                  <br />
                  <p className="font-bold">Date</p>
                  <p className="text-gray-500 text-sm">20-11-2023 10:46</p>
                </div>
              </div>
            </div>
            <div className="flex justify-left p-10 pt-2">
              <Collapse
                className="w-full flex flex-col items-left "
                items={items}
                defaultActiveKey={["1"]}
                onChange={onChange}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default IntegrityDetails;
