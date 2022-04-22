import { Proof } from "@bloock/sdk";
import moment from "moment";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { FileElement } from "../../pages/Home";
import { Truncate } from "../../utils/truncate";
import TooltipComponent from "../elements/Tooltip";

type VerificationSuccessProps = {
  element: FileElement | null;
  recordProof: Proof | null;
};

const VerificationSuccess: React.FC<VerificationSuccessProps> = ({
  element,
  recordProof,
}) => {
  const [expandedRows, setExpandedRows] = useState<any>(null);

  const timestamp = moment(
    (recordProof as any)?.anchor.networks[0].created_at * 1000
  ).format("DD-MM-YYYY HH:mm:ss");

  const tableNetworksData = (recordProof as any)?.anchor.networks.map(
    (network: any) => {
      const dates = moment(network.created_at * 1000).format(
        "DD-MM-YYYY HH:mm:ss"
      );
      let name = "";
      switch (network.name) {
        case "ethereum_mainnet":
          name = "Ethereum Mainnet";
          break;
        case "ethereum_rinkeby":
          name = "Ethereum Rinkeby";
          break;
        case "bloock_chain":
          name = "Bloockchain";
          break;
      }

      return {
        created_at: dates,
        name: network.name,
        label: name,
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
        tx_hash: network.tx_hash,
      };
    }
  );

  const networksCardData = (recordProof as any)?.anchor.networks.map(
    (network: any) => {
      const dates = moment(network.created_at * 1000).format(
        "DD-MM-YYYY HH:mm:ss"
      );

      let name = "";
      switch (network.name) {
        case "ethereum_mainnet":
          name = "Ethereum Mainnet";
          break;
        case "ethereum_rinkeby":
          name = "Ethereum Rinkeby";
          break;
        case "bloock_chain":
          name = "Bloockchain";
          break;
      }

      return (
        <div className="card">
          <div className="card-body" style={{ fontSize: "0.9rem" }}>
            <div className="d-flex justify-content-between py-1">
              <p className="bold-text">Name</p>
              <p>{name}</p>
            </div>
            <div className="d-flex justify-content-between py-1">
              <p className="bold-text">State</p>
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
                value={network.state}
              ></Tag>
            </div>
            <div className="d-flex justify-content-between py-1">
              <p className="bold-text">Timestamp</p>
              <p>{dates}</p>
            </div>
          </div>
        </div>
      );
    }
  );

  const rowExpansionTemplate = (network: any) => {
    let etherscanUrl = `https://etherscan.io/tx/${network.tx_hash}`;
    switch (network.name) {
      case "ethereum_mainnet":
        etherscanUrl = `https://etherscan.io/tx/${network.tx_hash}`;
        break;
      case "ethereum_rinkeby":
        etherscanUrl = `https://rinkeby.etherscan.io/tx/${network.tx_hash}`;
        break;
      case "bloock_chain":
        etherscanUrl = "";
        break;
    }

    return (
      <div className="orders-subtable">
        <p
          className="text-secondary text-uppercase bold-text"
          style={{ fontSize: "0.8rem" }}
        >
          Tx Hash
        </p>
        <div className="d-flex justify-content-between align-items-center text-break">
          <div style={{ width: "90%" }}>
            {network.tx_hash && network.tx_hash}
          </div>

          <Button
            icon="p-button-icon p-c pi pi-external-link"
            onClick={() => window.open(etherscanUrl, "_blank")}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {element?.name !== undefined ? (
        <div className={element.name ? "mb-3 mt-2" : "mb-0"}>
          <i
            className={`pi pi-file px-1 py-1 click-icon text-secondary ${
              element.name ? "d-inline" : "d-none"
            }`}
            style={{ fontWeight: 300 }}
          ></i>
          <span className="mx-2 text-secondary text-break">
            {Truncate(element.name as string, 50, "...")}
          </span>
        </div>
      ) : null}
      <div>
        <div className="mb-4 alert alert-success">
          <i
            className="pi pi-check-circle px-1"
            style={{ fontSize: "1.1rem" }}
          ></i>
          Your document has been verified
        </div>
      </div>
      <div
        className="text-secondary text-uppercase bold-text"
        style={{ fontSize: "0.8rem" }}
      >
        <p>Issuer</p>
      </div>
      <div>BLOOCK</div>
      <Divider className="my-3" style={{ borderBottom: "1px solid #dbdbdb" }} />
      <div
        className="text-secondary text-uppercase bold-text"
        style={{ fontSize: "0.8rem" }}
      >
        <p>Date</p>
      </div>
      <div>{timestamp}</div>
      <Divider className="my-3" style={{ borderBottom: "1px solid #dbdbdb" }} />

      <Accordion>
        <AccordionTab header="Technical details">
          {recordProof ? (
            <>
              <div
                className="text-secondary text-uppercase bold-text pt-3"
                style={{ fontSize: "0.8rem" }}
              >
                <TooltipComponent title="Document hash" description="">
                  <p>
                    Document hash{" "}
                    <i className="pi pi-question-circle px-1 py-1 text-secondary"></i>
                  </p>
                </TooltipComponent>
              </div>
              <div style={{ overflowWrap: "break-word" }}>
                {element?.record && element.record.getHash()}
              </div>

              <Divider
                className="my-3"
                style={{ borderBottom: "1px solid #dbdbdb" }}
              />
              <TooltipComponent
                title="Anchor"
                description="An anchor is a snapshot of the state tree which is registered to blockchain protocol. It is formed by the resulting state of the state transition."
              >
                <div
                  className="text-secondary text-uppercase bold-text"
                  style={{ fontSize: "0.8rem" }}
                >
                  <p>
                    Anchor
                    <i className="pi pi-question-circle px-1 py-1 text-secondary "></i>
                  </p>
                </div>
              </TooltipComponent>

              <div>{(recordProof as any).anchor.anchor_id}</div>

              <Divider
                className="my-3"
                style={{ borderBottom: "1px solid #dbdbdb" }}
              />
              <TooltipComponent
                title="Root"
                description="This value represents the root of the state tree. Users can easily verify the root of your blockchain in any of the public sources of Ethereum (i.e. https://etherscan.io/)."
              >
                <div
                  className="text-secondary text-uppercase bold-text"
                  style={{ fontSize: "0.8rem" }}
                >
                  <p>
                    Root
                    <i className="pi pi-question-circle px-1 py-1 text-secondary"></i>
                  </p>
                </div>
              </TooltipComponent>

              <div style={{ overflowWrap: "break-word" }}>
                <div>{(recordProof as any).root}</div>
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
            Networks
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
