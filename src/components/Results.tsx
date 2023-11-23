import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Card,
  Collapse,
  CollapseProps,
  Divider,
  Skeleton,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import Wrapper from "./Wrapper";
import { useVerification } from "../providers/VerificationProvider";
import moment from "moment";
import { formatBytes } from "../utils/utils";
import DocViewer, {
  DocViewerRenderers,
  IDocument,
} from "@cyntler/react-doc-viewer";
import { ComponentType } from "react";
import Link from "antd/es/typography/Link";
import { EllipsisMiddle } from "./EllipsisMiddle";
const { useToken } = theme;

function Results() {
  const { token } = useToken();
  const {
    isFileValid,
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails,
  } = useVerification();

  console.log(
    isFileValid,
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails
  );

  const integrityCollapse = () => {
    const networkColumns = [
      { title: "Network", dataIndex: "name", key: "network" },
      { title: "Status", dataIndex: "status", key: "status" },
      { title: "Timestamp", dataIndex: "timestamp", key: "timestamp" },
    ];

    const networkData = integrityDetails?.networks?.map((network, index) => {
      const getNetworkStatusColor = () => {
        switch (network.status) {
          case "Confirmed":
            return "success";
          case "Processing":
            return "warning";
          case "Pending":
            return "processing";
          case "Failed":
            return "error";
        }
      };

      return {
        ...network,
        status: (
          <Tag color={getNetworkStatusColor()} className="bg-gray-100 text-sm">
            {network.status}
          </Tag>
        ),
        timestamp: moment.unix(network.timestamp).format("DD-MM-YYYY hh:mm:ss"),
        key: index,
      };
    });

    return (
      <div className="flex flex-col items-start p-6">
        <Tooltip
          placement="leftTop"
          title="Digital Fingerprint of the document."
        >
          <p className="font-bold">
            <InfoCircleOutlined />
            &nbsp;Hash:
          </p>
        </Tooltip>
        <p className="text-gray-500 text-sm">{integrityDetails?.hash}</p>

        <Divider />
        <Tooltip
          placement="leftTop"
          title="Networks where document fingerprint was recorded"
        >
          <p className="font-bold">
            <InfoCircleOutlined />
            &nbsp;Networks:
          </p>
        </Tooltip>
        <Table
          className="w-full pt-4"
          columns={networkColumns}
          pagination={{ hideOnSinglePage: true }}
          expandable={{
            expandedRowRender: (network) => (
              <p style={{ margin: 10 }}>
                {
                  <div className="flex flex-col items-start">
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
                    </Tooltip>
                    <p className="text-gray-500 text-sm">{network.txHash}</p>
                    <Divider />
                    <Tooltip
                      placement="leftTop"
                      title="Identifier of the BLOOCK state transition the document has been included in"
                    >
                      <p className="font-bold">
                        <InfoCircleOutlined />
                        &nbsp;Anchor ID:
                      </p>
                    </Tooltip>
                    <p className="text-gray-500 text-sm">{network.anchorId}</p>
                    <Divider />
                    <Tooltip
                      placement="leftTop"
                      title="Digital fingerprint representing all records included in BLOOCK state since inception"
                    >
                      <p className="font-bold">
                        <InfoCircleOutlined />
                        &nbsp;Root:
                      </p>
                    </Tooltip>
                    <p className="text-gray-500 text-sm">{network.root}</p>
                  </div>
                }
              </p>
            ),
          }}
          dataSource={networkData}
        />
      </div>
    );
  };

  const authenticityCollapse = () => {
    const signatureColumns = [
      { title: "Signature", dataIndex: "title", key: "title" },
      { title: "Key", dataIndex: "kid", key: "kid" },
    ];

    const signatureData = authenticityDetails?.signatures?.map(
      (signature, index) => {
        return {
          ...signature,
          key: index,
          title: `Signature ${index + 1}`,
          kid: (
            <EllipsisMiddle lenght={30}>
              {signature.key || "Not available"}
            </EllipsisMiddle>
          ),
        };
      }
    );

    return (
      <div className="flex flex-col items-start p-6">
        <Tooltip
          placement="leftTop"
          title="Networks where document fingerprint was recorded"
        >
          <p className="font-bold">
            <InfoCircleOutlined />
            &nbsp;Signatures:
          </p>
        </Tooltip>

        <Table
          className="w-full pt-4"
          columns={signatureColumns}
          pagination={{ hideOnSinglePage: true }}
          expandable={{
            expandedRowRender: (signature) => (
              <div className="flex flex-col items-start p-6">
                <Tooltip
                  placement="leftTop"
                  title="Digital Fingerprint of the document."
                >
                  <p className="font-bold">
                    <InfoCircleOutlined />
                    &nbsp;Algorithm:
                  </p>
                </Tooltip>
                <p className="text-gray-500 text-sm">
                  {signature.signAlg || "Not available"}{" "}
                </p>
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
                <EllipsisMiddle lenght={40}>
                  {signature.signature}
                </EllipsisMiddle>
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
                {signature.kid}
              </div>
            ),
          }}
          dataSource={signatureData}
        />
      </div>
    );
  };

  const encryptionCollapse = () => {
    return (
      <div className="flex flex-col items-start p-6">
        <Tooltip
          placement="leftTop"
          title="Digital Fingerprint of the document."
        >
          <p className="font-bold">
            <InfoCircleOutlined />
            &nbsp;Algorithm:
          </p>
        </Tooltip>
        <p className="text-gray-500 text-sm">
          {encryptionDetails?.encryptionAlg || "Not available"}
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
          {encryptionDetails?.key || "Not available"}
        </p>
      </div>
    );
  };

  const availabilityCollapse = () => {
    return (
      <div className="flex flex-col items-start p-6">
        <Tooltip
          placement="leftTop"
          title="Networks where document fingerprint was recorded."
        >
          <p className="font-bold">
            <InfoCircleOutlined />
            &nbsp;File Name:
          </p>
        </Tooltip>
        <p className="text-gray-500 text-sm">{availabilityDetails?.filename}</p>
        <Divider />

        <Tooltip
          placement="leftTop"
          title="Networks where document fingerprint was recorded."
        >
          <p className="font-bold">
            <InfoCircleOutlined />
            &nbsp;Link:
          </p>
        </Tooltip>
        {availabilityDetails?.link ? (
          <Link
            copyable
            className="text-gray-500 text-sm"
            href={availabilityDetails?.link}
            target="_blank"
          >
            {availabilityDetails?.link || "Not available"}
          </Link>
        ) : (
          <p className="text-gray-500 text-sm">{"Not available"}</p>
        )}
        <Divider />
        <Tooltip
          placement="leftTop"
          title="Networks where document fingerprint was recorded."
        >
          <p className="font-bold">
            <InfoCircleOutlined />
            &nbsp;Size:
          </p>
        </Tooltip>
        <p className="text-gray-500 text-sm">
          {formatBytes(availabilityDetails?.size)}
        </p>
        <Divider />
        <Tooltip
          placement="leftTop"
          title="Networks where document fingerprint was recorded."
        >
          <p className="font-bold">
            <InfoCircleOutlined />
            &nbsp;Type:
          </p>
        </Tooltip>
        <p className="text-gray-500 text-sm">
          {availabilityDetails?.type || "Not available"}
        </p>
      </div>
    );
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Integrity details",
      children: integrityCollapse(),
      collapsible: integrityDetails?.enabled ? "header" : "disabled",
      extra: integrityDetails?.error && (
        <Tooltip placement="left" title={integrityDetails.error}>
          <ExclamationCircleOutlined style={{ color: token.colorError }} />
        </Tooltip>
      ),
    },
    {
      key: "2",
      label: "Authenticity details",
      children: authenticityCollapse(),
      collapsible: authenticityDetails?.enabled ? "header" : "disabled",
      extra: authenticityDetails?.error && (
        <Tooltip placement="left" title={authenticityDetails.error}>
          <ExclamationCircleOutlined style={{ color: token.colorError }} />
        </Tooltip>
      ),
    },
    {
      key: "3",
      label: "Access control details",
      children: encryptionCollapse(),
      collapsible: encryptionDetails?.enabled ? "header" : "disabled",
      extra: encryptionDetails?.error && (
        <Tooltip placement="left" title={encryptionDetails.error}>
          <ExclamationCircleOutlined style={{ color: token.colorError }} />
        </Tooltip>
      ),
    },
    {
      key: "4",
      label: "Availability details",
      children: availabilityCollapse(),
      extra: availabilityDetails?.error && (
        <Tooltip placement="left" title={availabilityDetails.error}>
          <ExclamationCircleOutlined style={{ color: token.colorError }} />
        </Tooltip>
      ),
    },
  ];

  const NoPreviewAvailable: ComponentType<{
    document: IDocument | undefined;
    fileName: string;
  }> = () => {
    return (
      <div className="w-64 h-48 rounded-md">
        <Skeleton.Image className="!h-full !w-full" />
        <p className="-mt-8 text-center text-xs">Preview not available</p>
      </div>
    );
  };

  return (
    <Wrapper>
      <div className="flex flex-wrap justify-center py-24">
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
              {availabilityDetails && (
                <DocViewer
                  documents={[
                    {
                      uri: URL.createObjectURL(
                        new Blob([availabilityDetails!.buffer], {
                          type: availabilityDetails!.type,
                        })
                      ),
                      fileName: availabilityDetails.filename,
                      fileType: availabilityDetails.type || "empty",
                    },
                  ]}
                  pluginRenderers={DocViewerRenderers}
                  style={{
                    backgroundColor: "transparent",
                  }}
                  config={{
                    header: {
                      disableHeader: true,
                    },
                    noRenderer: {
                      overrideComponent: NoPreviewAvailable,
                    },
                  }}
                />
              )}
            </div>
            <div className="flex flex-col items-left flex-1">
              {isFileValid === true && (
                <Tag
                  icon={<CheckCircleOutlined />}
                  color="success"
                  className="pl-8 bg-gray-100 flex items-center text-sm"
                  style={{ width: "450px", height: "35px" }}
                >
                  Your document has been verified
                </Tag>
              )}

              {isFileValid === false && (
                <Tag
                  icon={<CloseCircleOutlined />}
                  color="error"
                  className="pl-8 bg-gray-100 flex items-center text-sm"
                  style={{ width: "450px", height: "35px" }}
                >
                  Your document is not valid
                </Tag>
              )}

              {isFileValid === undefined && (
                <Tag
                  icon={<InfoCircleOutlined />}
                  color="warning"
                  className="pl-8 bg-gray-100 flex items-center text-sm"
                  style={{ width: "450px", height: "35px" }}
                >
                  Your document couldn't be verified
                </Tag>
              )}
              <div className="p-4">
                <p className="font-bold">Name</p>
                <p className="text-gray-500 text-sm">
                  {availabilityDetails?.filename}
                </p>
                <br />
                <p className="font-bold">Issuer</p>
                <p className="text-gray-500 text-sm">Harvard University</p>
                <br />
                {integrityDetails?.timestamp && (
                  <>
                    <p className="font-bold">Date</p>
                    <p className="text-gray-500 text-sm">
                      {moment
                        .unix(integrityDetails.timestamp)
                        .format("DD-MM-YYYY hh:mm:ss")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-left p-10 pt-2">
            <Collapse
              className="w-full flex flex-col items-left "
              items={items}
              defaultActiveKey={[]}
            />
          </div>
        </Card>
      </div>
    </Wrapper>
  );
}

export default Results;
