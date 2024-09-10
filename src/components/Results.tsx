import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  CollapseProps,
  Divider,
  Row,
  Table,
  Tag,
  Tooltip,
  theme,
} from "antd";
import Link from "antd/es/typography/Link";
import moment from "moment";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { useVerification } from "../providers/VerificationProvider";
import {
  decodeString,
  formatBytes,
  getNetworkTranslation,
  getTxHashURL,
} from "../utils/utils";
import { EllipsisMiddle } from "./EllipsisMiddle";
import FilePreview from "./FilePreview";
import Wrapper from "./Wrapper";

const { useToken } = theme;

function Results() {
  const { t } = useTranslation();
  const { token } = useToken();
  const {
    isFileValid,
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails,
    reset,
  } = useVerification();

  console.log(
    isFileValid,
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails
  );

  const Field: React.FC<
    PropsWithChildren<{ tooltip?: string; label: string }>
  > = (props) => (
    <>
      {props.tooltip ? (
        <Tooltip placement="leftTop" title={props.tooltip}>
          <p className="font-bold">
            <InfoCircleOutlined className="mr-1" />
            {props.label}:
          </p>
        </Tooltip>
      ) : (
        <p className="font-bold">{props.label}:</p>
      )}
      <p className="w-full pt-2 text-gray-500 text-sm break-all truncate">
        {props.children}
      </p>
    </>
  );

  const integrityCollapse = () => {
    const networkColumns = [
      {
        title: t("results.integrity.network"),
        dataIndex: "name",
        key: "network",
      },
      {
        title: t("results.integrity.status"),
        dataIndex: "status",
        key: "status",
      },
      {
        title: t("results.integrity.timestamp"),
        dataIndex: "timestamp",
        key: "timestamp",
      },
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
        name: t(getNetworkTranslation(network)),
        status: (
          <Tag color={getNetworkStatusColor()} className="bg-gray-100 text-sm">
            {network.status}
          </Tag>
        ),
        timestamp: network.timestamp
          ? moment.unix(network.timestamp).format("DD-MM-YYYY HH:mm:ss")
          : t("results.not-available"),
        url: getTxHashURL(network.name, network.txHash),
        key: index,
      };
    });

    return (
      <div className="flex flex-col items-start p-6">
        <Field
          tooltip={t("results.tooltip.hash")}
          label={t("results.integrity.hash")}
        >
          {integrityDetails?.hash}
        </Field>
        <Divider />
        <Field
          tooltip={t("results.tooltip.networks")}
          label={t("results.integrity.networks.label")}
        >
          <Table
            className="w-full pt-4 break-normal"
            columns={networkColumns}
            pagination={{ hideOnSinglePage: true }}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (network) => (
                <div style={{ margin: 10 }}>
                  <div className="flex flex-col items-start">
                    <Field
                      tooltip={t("results.tooltip.tx-hash")}
                      label={t("results.integrity.tx-hash")}
                    >
                      {network.url ? (
                        <Link
                          className="text-gray-500 text-sm"
                          href={network.url}
                          target="_blank"
                        >
                          {network.txHash || t("results.not-available")}
                        </Link>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          {network.txHash}
                        </p>
                      )}
                    </Field>
                    <Divider />
                    <Field
                      tooltip={t("results.tooltip.anchor-id")}
                      label={t("results.integrity.anchor-id")}
                    >
                      {network.anchorId}
                    </Field>
                    <Divider />
                    <Field
                      tooltip={t("results.tooltip.root")}
                      label={t("results.integrity.root")}
                    >
                      {network.root || t("results.not-available")}
                    </Field>
                  </div>
                </div>
              ),
            }}
            dataSource={networkData}
          />
        </Field>
      </div>
    );
  };

  const authenticityCollapse = () => {
    const signatureColumns = [
      {
        title: t("results.authenticity.signature"),
        dataIndex: "title",
        key: "title",
      },
      {
        title: t("results.authenticity.subject"),
        dataIndex: "commonName",
        key: "commonName",
        render: (_: any, rest: any) => decodeString(rest.commonName),
      },
    ];

    const signatureData = authenticityDetails?.signatures?.map(
      (signature, index) => {
        return {
          ...signature,
          key: index,
          title: `${t("results.authenticity.signature")} ${index + 1}`,
          commonName: signature.subject?.CN || t("results.not-available"),
        };
      }
    );

    return (
      <div className="flex flex-col items-start p-6">
        <Field
          tooltip={t("results.tooltip.signatures")}
          label={t("results.authenticity.signatures")}
        >
          <Table
            className="w-full pt-4 break-normal"
            columns={signatureColumns}
            pagination={{ hideOnSinglePage: true }}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (signature) => (
                <div className="flex flex-col items-start p-6">
                  <Field
                    tooltip={t("results.tooltip.algorithm")}
                    label={t("results.authenticity.algorithm")}
                  >
                    {signature.alg || t("results.not-available")}
                  </Field>
                  <Divider />
                  <Field
                    tooltip={t("results.tooltip.signature")}
                    label={t("results.authenticity.signature")}
                  >
                    <EllipsisMiddle length={40}>
                      {signature.signature}
                    </EllipsisMiddle>
                  </Field>
                  <Divider />
                  <Field
                    tooltip={t("results.tooltip.public-key")}
                    label={t("results.authenticity.public-key")}
                  >
                    <EllipsisMiddle length={30} value={signature.kid}>
                      {signature.kid
                        ? t("results.authenticity.copy-key")
                        : t("results.not-available")}
                    </EllipsisMiddle>
                  </Field>
                  {signature.subject?.CN && (
                    <>
                      <Divider />
                      <Field label={t("results.authenticity.common-name")}>
                        {decodeString(signature.subject?.CN)}
                      </Field>
                    </>
                  )}
                  {signature.subject?.OU && (
                    <>
                      <Divider />
                      <Field
                        label={t("results.authenticity.organization-unit")}
                      >
                        {decodeString(signature.subject?.OU)}
                      </Field>
                    </>
                  )}
                  {signature.subject?.O && (
                    <>
                      <Divider />
                      <Field label={t("results.authenticity.organization")}>
                        {decodeString(signature.subject?.O)}
                      </Field>
                    </>
                  )}
                  {signature.subject?.L && (
                    <>
                      <Divider />
                      <Field label={t("results.authenticity.location")}>
                        {decodeString(signature.subject?.L)}
                      </Field>
                    </>
                  )}
                  {signature.subject?.ST && (
                    <>
                      <Divider />
                      <Field label={t("results.authenticity.state")}>
                        {decodeString(signature.subject?.ST)}
                      </Field>
                    </>
                  )}
                  {signature.subject?.C && (
                    <>
                      <Divider />
                      <Field label={t("results.authenticity.country")}>
                        {decodeString(signature.subject?.C)}
                      </Field>
                    </>
                  )}
                </div>
              ),
            }}
            dataSource={signatureData}
          />
        </Field>
      </div>
    );
  };

  const encryptionCollapse = () => {
    return (
      <div className="flex flex-col items-start p-6">
        <Field
          tooltip={t("results.tooltip.algorithm")}
          label={t("results.encryption.algorithm")}
        >
          {encryptionDetails?.alg || t("results.not-available")}
        </Field>
        <Divider />

        <Field
          tooltip={t("results.tooltip.public-key")}
          label={t("results.encryption.public-key")}
        >
          <EllipsisMiddle length={30} value={encryptionDetails?.key}>
            {encryptionDetails?.key
              ? t("results.encryption.copy-key")
              : t("results.not-available")}
          </EllipsisMiddle>
        </Field>

        {encryptionDetails?.subject?.CN && (
          <>
            <Divider />
            <Field label={t("results.encryption.common-name")}>
              {decodeString(encryptionDetails.subject?.CN)}
            </Field>
          </>
        )}
        {encryptionDetails?.subject?.OU && (
          <>
            <Divider />
            <Field label={t("results.encryption.organization-unit")}>
              {decodeString(encryptionDetails.subject?.OU)}
            </Field>
          </>
        )}
        {encryptionDetails?.subject?.O && (
          <>
            <Divider />
            <Field label={t("results.encryption.organization")}>
              {decodeString(encryptionDetails.subject?.O)}
            </Field>
          </>
        )}
        {encryptionDetails?.subject?.L && (
          <>
            <Divider />
            <Field label={t("results.encryption.location")}>
              {decodeString(encryptionDetails.subject?.L)}
            </Field>
          </>
        )}
        {encryptionDetails?.subject?.ST && (
          <>
            <Divider />
            <Field label={t("results.encryption.state")}>
              {decodeString(encryptionDetails.subject?.ST)}
            </Field>
          </>
        )}
        {encryptionDetails?.subject?.C && (
          <>
            <Divider />
            <Field label={t("results.encryption.country")}>
              {decodeString(encryptionDetails.subject?.C)}
            </Field>
          </>
        )}
      </div>
    );
  };

  const availabilityCollapse = () => {
    return (
      <div className="flex flex-col items-start p-6">
        <Field
          tooltip={t("results.tooltip.filename")}
          label={t("results.availability.filename")}
        >
          {availabilityDetails?.filename}
        </Field>
        <Divider />
        <Field
          tooltip={t("results.tooltip.link")}
          label={t("results.availability.link")}
        >
          {availabilityDetails?.link ? (
            <Link
              copyable
              className="text-gray-500 text-sm"
              href={availabilityDetails?.link}
              target="_blank"
            >
              {availabilityDetails?.link || t("results.not-available")}
            </Link>
          ) : (
            <p className="text-gray-500 text-sm">
              {t("results.not-available")}
            </p>
          )}
        </Field>
        <Divider />
        <Field
          tooltip={t("results.tooltip.size")}
          label={t("results.availability.size")}
        >
          {formatBytes(availabilityDetails?.size)}
        </Field>
        <Divider />
        <Field
          tooltip={t("results.tooltip.content-type")}
          label={t("results.availability.content-type")}
        >
          {availabilityDetails?.type || t("results.not-available")}
        </Field>
      </div>
    );
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: t("results.integrity.title"),
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
      label: t("results.authenticity.title"),
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
      label: t("results.encryption.title"),
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
      label: t("results.availability.title"),
      children: availabilityCollapse(),
      extra: availabilityDetails?.error && (
        <Tooltip placement="left" title={availabilityDetails.error}>
          <ExclamationCircleOutlined style={{ color: token.colorError }} />
        </Tooltip>
      ),
    },
  ];

  return (
    <Wrapper>
      <div className="w-11/12 md:w-2/3 flex justify-center py-24">
        <Card
          className="h-full w-full flex flex-col p-0 md:p-4"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
          bordered={false}
        >
          <Button
            type="text"
            shape="circle"
            size="large"
            icon={<CloseOutlined />}
            onClick={() => reset()}
          />
          <Row gutter={[16, 16]} className="p-6">
            <Col lg={10} span={24}>
              {availabilityDetails && (
                <FilePreview
                  payload={
                    availabilityDetails!.payload || availabilityDetails.buffer
                  }
                  name={availabilityDetails.filename}
                  type={availabilityDetails.type || "empty"}
                />
              )}
            </Col>
            <Col lg={14} span={24}>
              {isFileValid === true && (
                <Tag
                  icon={<CheckCircleOutlined />}
                  color="success"
                  className="pl-4 bg-gray-100 flex items-center text-sm"
                  style={{ width: "auto", height: "35px" }}
                >
                  {t("results.verification.success")}
                </Tag>
              )}

              {isFileValid === false && (
                <Tag
                  icon={<CloseCircleOutlined />}
                  color="error"
                  className="pl-8 bg-gray-100 flex items-center text-sm"
                  style={{ width: "auto", height: "35px" }}
                >
                  {t("results.verification.error")}
                </Tag>
              )}

              {isFileValid === undefined && (
                <Tag
                  icon={<InfoCircleOutlined />}
                  color="warning"
                  className="p-4 bg-gray-100 flex items-center text-sm"
                  style={{ width: "auto", height: "35px" }}
                >
                  {t("results.verification.invalid")}
                </Tag>
              )}
              <div className="w-full p-4">
                <p className="font-bold">{t("results.general.name")}</p>
                <p className="text-gray-500 text-sm">
                  <EllipsisMiddle length={30}>
                    {availabilityDetails?.filename}
                  </EllipsisMiddle>
                </p>
                <br />
                <p className="font-bold">{t("results.general.issuer")}</p>
                <p className="text-gray-500 text-sm">
                  {decodeString(authenticityDetails?.subject?.CN) ||
                    t("results.not-available")}
                </p>
                <br />
                {integrityDetails?.timestamp && (
                  <>
                    <p className="font-bold">{t("results.general.date")}</p>
                    <p className="text-gray-500 text-sm">
                      {moment
                        .unix(integrityDetails.timestamp)
                        .format("DD-MM-YYYY HH:mm:ss")}
                    </p>
                  </>
                )}
              </div>
            </Col>
          </Row>
          <div className="flex flex-row p-6">
            <Collapse
              className="w-full flex flex-col items-left "
              items={items}
              defaultActiveKey={[]}
            />
          </div>
          <div className="flex flex-row justify-center p-4">
            <Button type="primary" size="large" onClick={() => reset()}>
              {t("results.verify-another")}
            </Button>
          </div>
        </Card>
      </div>
    </Wrapper>
  );
}

export default Results;
