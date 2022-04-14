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

  const tableNetworksData = (recordProof as any)?.anchor.networks.map(
    (network: any) => {
      const dates = moment(network.created_at * 1000).format(
        "DD-MM-YYYY HH:mm:ss"
      );
      return {
        created_at: dates,
        name: network.name,
        label:
          network.name === "ethereum_rinkeby"
            ? "Ethereum Rinkeby"
            : network.name,
        state: (
          <Tag
            icon={
              network.state === "Confirmed"
                ? "pi pi-check"
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
        ),
        tx_hash: network.tx_hash,
      };
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
        <p className="bold-text pt-3">Tx Hash</p>
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
        <div className={element.name ? "mb-5" : "mb-0"}>
          <i
            className=" pi pi-file px-2 py-1 click-icon "
            style={
              element.name
                ? {
                    display: "inline",
                    color: "#495057",
                    fontSize: "1.3rem",
                    fontWeight: 100,
                  }
                : {
                    display: "none",
                    color: "#495057",
                    fontSize: "1.3rem",
                    fontWeight: 100,
                  }
            }
          ></i>
          <span className="mx-2 bold-text">
            {Truncate(element.name as string, 50, "...")}
          </span>
        </div>
      ) : null}
      <div>
        <div className="my-3">
          <p className="color-success">
            <i className="pi pi-check-circle px-1 "></i>
            Your document has been verified
          </p>
        </div>
      </div>
      <div className="bold-text">
        <TooltipComponent title="Document hash" description="">
          <p>
            Document hash{" "}
            <i className="pi pi-question-circle px-2 py-1 text-secondary "></i>
          </p>
        </TooltipComponent>
      </div>
      <div style={{ overflowWrap: "break-word" }}>
        {element?.record && element.record.getHash()}
      </div>
      <Divider className="my-2 pb-2" />
      <div className="bold-text">
        <TooltipComponent title="Issuer" description="Issuer description">
          <p>
            Issuer
            <i className="pi pi-question-circle px-2 py-1 text-secondary "></i>
          </p>
        </TooltipComponent>
      </div>
      <div>BLOOCK</div>
      <Divider className="my-2 pb-2" />
      <Accordion>
        <AccordionTab header="More Details">
          {recordProof ? (
            <>
              <Divider className="my-2 pb-2" />
              <TooltipComponent
                title="Anchor"
                description="An anchor is a snapshot of the state tree which is registered to blockchain protocol. It is formed by the resulting state of the state transition."
              >
                <div className="bold-text">
                  <p>
                    Anchor
                    <i className="pi pi-question-circle px-2 py-1 text-secondary "></i>
                  </p>
                </div>
              </TooltipComponent>

              <div>{(recordProof as any).anchor.anchor_id}</div>

              <Divider className="my-2 pb-2" />
              <TooltipComponent
                title="Root"
                description="This value represents the root of the state tree. Users can easily verify the root of your blockchain in any of the public sources of Ethereum (i.e. https://etherscan.io/)."
              >
                <div className="bold-text">
                  <p>
                    Root
                    <i className="pi pi-question-circle px-2 py-1 text-secondary "></i>
                  </p>
                </div>
              </TooltipComponent>

              <div style={{ overflowWrap: "break-word" }}>
                <div>{(recordProof as any).root}</div>
              </div>
              <Divider className="my-2 pb-2" />
            </>
          ) : null}
          <div className="bold-text">Networks</div>
          <div className="card my-3">
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
        </AccordionTab>
      </Accordion>

      <Divider className="my-2 pb-2" />
    </>
  );
};

export default VerificationSuccess;
