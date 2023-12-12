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
  Collapse,
  CollapseProps,
  Divider,
  Skeleton,
  Table,
  Tag,
  Tooltip,
  theme,
} from "antd";
import Wrapper from "./Wrapper";
import { useVerification } from "../providers/VerificationProvider";
import moment from "moment";
import {
  formatBytes,
  getNetworkTranslation,
  getTxHashURL,
} from "../utils/utils";
import DocViewer, {
  DocViewerRenderers,
  IDocument,
} from "@cyntler/react-doc-viewer";
import { ComponentType, PropsWithChildren } from "react";
import Link from "antd/es/typography/Link";
import { EllipsisMiddle } from "./EllipsisMiddle";
import { useTranslation } from "react-i18next";
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
      <Tooltip placement="leftTop" title={props.tooltip}>
        <p className="font-bold">
          <InfoCircleOutlined className="mr-1" />
          {props.label}:
        </p>
      </Tooltip>
      <p className="w-full pt-2 text-gray-500 text-sm">{props.children}</p>
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
          ? moment.unix(network.timestamp).format("DD-MM-YYYY hh:mm:ss")
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
            className="w-full pt-4"
            columns={networkColumns}
            pagination={{ hideOnSinglePage: true }}
            expandable={{
              expandedRowRender: (network) => (
                <p style={{ margin: 10 }}>
                  {
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
                  }
                </p>
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
      },
    ];

    const signatureData = authenticityDetails?.signatures?.map(
      (signature, index) => {
        return {
          ...signature,
          key: index,
          title: `${t("results.authenticity.signature")} ${index + 1}`,
          commonName:
            authenticityDetails?.subject?.CN || t("results.not-available"),
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
            className="w-full pt-4"
            columns={signatureColumns}
            pagination={{ hideOnSinglePage: true }}
            expandable={{
              expandedRowRender: (signature) => (
                <div className="flex flex-col items-start p-6">
                  <Field
                    tooltip={t("results.tooltip.subject")}
                    label={t("results.authenticity.subject")}
                  >
                    {signature.commonName}
                  </Field>
                  <Divider />
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
                    <EllipsisMiddle lenght={40}>
                      {signature.signature}
                    </EllipsisMiddle>
                  </Field>
                  <Divider />
                  <Field
                    tooltip={t("results.tooltip.public-key")}
                    label={t("results.authenticity.public-key")}
                  >
                    <EllipsisMiddle lenght={30}>
                      {signature.kid
                        ? t("results.authenticity.copy-key")
                        : t("results.not-available")}
                    </EllipsisMiddle>
                  </Field>
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
          {encryptionDetails?.key || t("results.not-available")}
        </Field>

        <Divider />

        <Field
          tooltip={t("results.tooltip.subject")}
          label={t("results.encryption.subject")}
        >
          {encryptionDetails?.subject || t("results.not-available")}
        </Field>
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

  const NoPreviewAvailable: ComponentType<{
    document: IDocument | undefined;
    fileName: string;
  }> = () => {
    return (
      <div className="w-64 h-48 rounded-md">
        <Skeleton.Image className="!h-full !w-full" />
        <p className="-mt-8 text-center text-xs">
          {t("results.preview.not-available")}
        </p>
      </div>
    );
  };

  return (
    <Wrapper>
      <div className="flex justify-center py-24 sm:py-12 md:py-16 lg:py-24">
        <Card
          className="w-full h-full flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12"
          style={{
            width: "90%",
            minHeight: "100vh",
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
          <div className="flex flex-col sm:flex-row p-4">
            <div className="flex flex-col items-center sm:items-start sm:mr-12 mb-6 sm:mb-2">
              {availabilityDetails && (
                <DocViewer
                  documents={[
                    {
                      uri: URL.createObjectURL(
                        new Blob(
                          [
                            availabilityDetails!.payload ||
                              availabilityDetails.buffer,
                          ],
                          {
                            type: availabilityDetails!.type,
                          }
                        )
                      ),
                      fileName: availabilityDetails.filename,
                      fileType: availabilityDetails.type || "empty",
                    },
                  ]}
                  pluginRenderers={DocViewerRenderers}
                  style={{
                    backgroundColor: "",
                    width: "auto",
                    height: "auto",
                    maxWidth: "350px",
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
            <div className="flex flex-col items-center sm:items-start">
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
              <div className="p-4">
                <p className="font-bold">{t("results.general.name")}</p>
                <p className="text-gray-500 text-sm">
                  {availabilityDetails?.filename}
                </p>
                <br />
                <p className="font-bold">{t("results.general.issuer")}</p>
                <p className="text-gray-500 text-sm">
                  {authenticityDetails?.subject?.CN ||
                    t("results.not-available")}
                </p>
                <br />
                {integrityDetails?.timestamp && (
                  <>
                    <p className="font-bold">{t("results.general.date")}</p>
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
          <div className="flex flex-col sm:flex-row p-6">
            <Collapse
              className="w-full flex flex-col items-left "
              items={items}
              defaultActiveKey={[]}
            />
          </div>
          <div className="flex flex-col justify-center sm:flex-row p-4">
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
