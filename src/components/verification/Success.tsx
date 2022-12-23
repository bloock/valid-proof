import { Proof } from "@bloock/sdk";
import moment from "moment";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileElement } from "../../pages/Home";
import { Truncate } from "../../utils/truncate";
import TooltipComponent from "../elements/Tooltip";
import { RecordNetwork } from "./VerificationMain";

type VerificationSuccessProps = {
  element: FileElement;
  recordRoot: string;
  recordProof: Proof;
  recordNetworks: RecordNetwork[];
};

const VerificationSuccess: React.FC<VerificationSuccessProps> = ({
  element,
  recordProof,
  recordRoot,
  recordNetworks,
}) => {
  const { t } = useTranslation("success");

  const [expandedRows, setExpandedRows] = useState<any>(null);
  const [recordHash, setRecordHash] = useState<string>("");
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    let t = recordNetworks.map((network) => network.timestamp).sort()[
      recordNetworks.length - 1
    ];

    setTimestamp(moment(t * 1000).format("DD-MM-YYYY HH:mm:ss"));
  }, [recordNetworks]);

  useEffect(() => {
    const getRoot = async () => {
      if (element.record) {
        try {
          const hash = await element.record?.getHash();
          setRecordHash(hash);
        } catch (e) {
          console.log(e);
        }
      }
    };

    getRoot();
  }, [element]);

  useEffect(() => {
    const getHash = async () => {
      if (element.record) {
        try {
          const hash = await element.record?.getHash();
          setRecordHash(hash);
        } catch (e) {
          console.log(e);
        }
      }
    };

    getHash();
  }, [element]);

  const tableNetworksData = recordNetworks.map((network) => {
    const dates = moment(network.timestamp * 1000).format(
      "DD-MM-YYYY HH:mm:ss"
    );

    return {
      created_at: dates,
      name: network.name,
      label: t(network.name),
      state: (
        <Tag
          icon={
            network.state === "Confirmed"
              ? "pi pi-check-circle"
              : "pi pi-exclamation-triangle"
          }
          style={
            network.state === "Confirmed"
              ? {
                  fontWeight: "100",
                  backgroundColor: "#DEF5F3",
                  color: "#719d8c",
                }
              : {
                  fontWeight: "100",
                  backgroundColor: "#fee9d8",
                  color: "#9f978b",
                }
          }
          severity={network.state === "Confirmed" ? "success" : "warning"}
          value={network.state}
        ></Tag>
      ),
      tx_hash: network.txHash,
    };
  });

  const networksCardData = recordNetworks.map((network) => {
    const dates = moment(network.timestamp * 1000).format(
      "DD-MM-YYYY HH:mm:ss"
    );

    let explorerUrl = `https://etherscan.io/tx/${network.txHash}`;
    switch (network.name) {
      case "ethereum_mainnet":
        explorerUrl = `https://etherscan.io/tx/${network.txHash}`;
        break;
      case "ethereum_rinkeby":
        explorerUrl = `https://rinkeby.etherscan.io/tx/${network.txHash}`;
        break;
      case "gnosis_chain":
        explorerUrl = `https://blockscout.com/xdai/mainnet/tx/${network.txHash}`;
        break;
      case "polygon_chain":
        explorerUrl = `https://polygonscan.com/tx/${network.txHash}`;
        break;
      case "bloock_chain":
        explorerUrl = "";
        break;
    }

    return (
      <div className="card">
        <div className="card-body" style={{ fontSize: "0.9rem" }}>
          <div className="d-flex justify-content-between align-items-center py-1">
            <p className="bold-text text-secondary ">{t("name")}</p>
            <div className="d-flex align-items-center">
              <p style={{ textAlign: "right" }}>
                {t(network.name && network.name)}
              </p>
              <Button
                style={{ marginLeft: "7px", width: "15%" }}
                icon="p-button-icon p-c pi pi-external-link"
                onClick={() => window.open(explorerUrl, "_blank")}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between py-1">
            <p className="bold-text text-secondary">{t("state")}</p>
            <Tag
              icon={
                network.state === "Confirmed"
                  ? "pi pi-check-circle"
                  : "pi pi-exclamation-triangle"
              }
              style={
                network.state === "Confirmed"
                  ? {
                      fontWeight: "100",
                      backgroundColor: "#DEF5F3",
                      color: "#9CB3B1",
                    }
                  : {
                      fontWeight: "100",
                      backgroundColor: "#DEF5F3",
                      color: "#B3AA9C",
                    }
              }
              severity={network.state === "Confirmed" ? "success" : "warning"}
              value={network?.state}
            ></Tag>
          </div>
          <div className="d-flex justify-content-between py-1">
            <p className="bold-text text-secondary">{t("timestamp")}</p>
            <p style={{ textAlign: "right" }}>{dates && dates}</p>
          </div>
        </div>
      </div>
    );
  });

  const rowExpansionTemplate = (network: any) => {
    let explorerUrl = `https://etherscan.io/tx/${network.tx_hash}`;
    switch (network.name) {
      case "ethereum_mainnet":
        explorerUrl = `https://etherscan.io/tx/${network.tx_hash}`;
        break;
      case "ethereum_rinkeby":
        explorerUrl = `https://rinkeby.etherscan.io/tx/${network.tx_hash}`;
        break;
      case "gnosis_chain":
        explorerUrl = `https://blockscout.com/xdai/mainnet/tx/${network.tx_hash}`;
        break;
      case "polygon_chain":
        explorerUrl = `https://polygonscan.com/tx/${network.tx_hash}`;
        break;
      case "bloock_chain":
        explorerUrl = "";
        break;
    }

    return (
      <div className="orders-subtable">
        <p
          className="text-secondary text-uppercase bold-text"
          style={{ fontSize: "0.8rem" }}
        >
          {t("tx-hash")}
        </p>
        <div className="d-flex justify-content-between align-items-center text-break">
          <div style={{ width: "90%" }}>
            {network?.tx_hash && network?.tx_hash}
          </div>

          {network.name !== "bloock_chain" && (
            <Button
              icon="p-button-icon p-c pi pi-external-link"
              onClick={() => window.open(explorerUrl, "_blank")}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {element?.name !== undefined || element?.name !== "" ? (
        <div className={element?.name ? "mb-3 mt-2" : "mb-0"}>
          <i
            className={`pi pi-file px-1 py-1 click-icon text-secondary ${
              element?.name ? "d-inline" : "d-none"
            }`}
            style={{ fontWeight: 300 }}
          ></i>
          <span className="mx-1 text-secondary text-break">
            {Truncate(element?.name as string, 30, "...")}
          </span>
        </div>
      ) : null}
      <div>
        <div className="mb-4 alert alert-success">
          <i
            className="pi pi-check-circle px-2"
            style={{ fontSize: "1rem" }}
          ></i>
          {t("verified")}
        </div>
      </div>
      <div
        className="text-secondary text-uppercase bold-text"
        style={{ fontSize: "0.8rem" }}
      >
        <p>{t("issuer")}</p>
      </div>
      <div>{t("bloock")}</div>
      <Divider className="my-3" style={{ borderBottom: "1px solid #dbdbdb" }} />
      <div
        className="text-secondary text-uppercase bold-text"
        style={{ fontSize: "0.8rem" }}
      >
        <p>{t("date")}</p>
      </div>
      <div>{timestamp}</div>
      <Divider className="my-3" style={{ borderBottom: "1px solid #dbdbdb" }} />

      <Accordion>
        <AccordionTab header={t("details")}>
          {recordProof ? (
            <>
              <div
                className="text-secondary text-uppercase bold-text pt-3"
                style={{ fontSize: "0.8rem" }}
              >
                <TooltipComponent
                  title={t("document-hash")}
                  description={t("document-hash-description")}
                >
                  <p className="d-flex align-items-center">
                    {t("document-hash")}
                    <i className="pi pi-question-circle px-2 py-1 text-secondary"></i>
                  </p>
                </TooltipComponent>
              </div>
              <div style={{ overflowWrap: "break-word" }}>{recordHash}</div>

              <Divider
                className="my-3"
                style={{ borderBottom: "1px solid #dbdbdb" }}
              />
              <TooltipComponent
                title={t("anchor")}
                description={t("anchor-description")}
              >
                <div
                  className="text-secondary text-uppercase bold-text"
                  style={{ fontSize: "0.8rem" }}
                >
                  <p className="d-flex align-items-center">
                    {t("anchor")}
                    <i className="pi pi-question-circle px-2 py-1 text-secondary "></i>
                  </p>
                </div>
              </TooltipComponent>

              <div>{recordProof.anchor.anchorID}</div>

              <Divider
                className="my-3"
                style={{ borderBottom: "1px solid #dbdbdb" }}
              />
              <TooltipComponent
                title={t("root")}
                description={t("root-description")}
              >
                <div
                  className="text-secondary text-uppercase bold-text"
                  style={{ fontSize: "0.8rem" }}
                >
                  <p className="d-flex align-items-center">
                    {t("root")}
                    <i className="pi pi-question-circle px-2 py-1 text-secondary"></i>
                  </p>
                </div>
              </TooltipComponent>

              <div style={{ overflowWrap: "break-word" }}>
                <div>{recordRoot}</div>
              </div>
              <Divider
                className="my-3"
                style={{ borderBottom: "1px solid #dbdbdb" }}
              />
            </>
          ) : null}

          <div
            className="text-secondary text-uppercase bold-text pb-1"
            style={{ fontSize: "0.8rem" }}
          >
            {t("networks")}
          </div>

          <div className="card my-3 networks-table-info">
            <DataTable
              value={tableNetworksData}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              responsiveLayout="scroll"
              dataKey="id"
            >
              <Column expander style={{ width: "3em" }} />
              <Column field="label" header="Name"></Column>
              <Column field="state" header="State"></Column>
              <Column field="created_at" header="Timestamp"></Column>
            </DataTable>
          </div>
          <div className="networks-cards-info">{networksCardData}</div>
        </AccordionTab>
      </Accordion>
    </>
  );
};

export default VerificationSuccess;
