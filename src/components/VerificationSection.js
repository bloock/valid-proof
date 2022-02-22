import React, { useEffect, useRef, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Timeline } from "primereact/timeline";
import "../customstyles.css";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import { Button } from "primereact/button";

const VerificationSection = ({
  isProofRetrieved,
  isProofValidated,
  isBlockchainRegistrated,
  selectedFile,
  documentHash,
  date,
  acceptedFiles,
}) => {
  const [firstStepColor, setFirstStepColor] = useState("#d7d7d7");
  const [secondStepColor, setSecondStepColor] = useState("#d7d7d7");
  const [thirdStepColor, setThirdStepColor] = useState("#d7d7d7");
  const [successMessage, setSuccessMessage] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);

  function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(() => {
    setInterval(() => {
      setFirstStepColor("#06d7be");
    }, getRandomInterval(1000, 1700));
  });
  useEffect(() => {
    setInterval(() => {
      setSecondStepColor("#06d7be");
    }, getRandomInterval(1700, 2400));
  });
  useEffect(() => {
    setInterval(() => {
      setThirdStepColor("#06d7be");
    }, getRandomInterval(2400, 3300));
  });
  useEffect(() => {
    setInterval(() => {
      setSuccessMessage(true);
    }, getRandomInterval(3300, 4000));
  });

  const events = [
    {
      status: "Retrieve integrity proof",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: isProofRetrieved ? firstStepColor : "#d7d7d7",
    },
    {
      status: "Validate integrity proof",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: isProofValidated ? secondStepColor : "#d7d7d7",
    },
    {
      status: "Validate blockchain registrations",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: isProofValidated ? thirdStepColor : "#d7d7d7",
    },
  ];

  const customizedMarker = (item) => {
    return (
      <span
        className="custom-marker p-shadow-2 circle"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    );
  };

  const customizedContent = (item) => {
    if (item.status === events[events.length - 1].status) {
      return (
        <div className="horizontal-center half-right double-width">
          <div>{item.status}</div>
          <div className="px-4">
            <span>{item.description}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="horizontal-center half-right">
          <div>{item.status}</div>
          <div className="px-4">
            <span>{item.description}</span>
          </div>
        </div>
      );
    }
  };

  const handleEtherscanRedirect = () => {
    return window.open("https://etherscan.io/");
  };
  const searchBodyTemplate = () => {
    return (
      <Button
        icon="p-button-icon p-c pi pi-external-link"
        onClick={handleEtherscanRedirect}
      />
    );
  };

  const tableNetworksData = isProofRetrieved.anchor.networks.map((network) => {
    const dates = moment(network.created_at * 1000).format(
      "DD-MM-YYYY HH:mm:ss"
    );
    return {
      created_at: dates,
      name: (
        <div>
          {network.name === "ethereum_rinkeby"
            ? (network.name = "Ethereum Rinkeby")
            : network.name}
        </div>
      ),
      state: network.state,
      tx_hash: network.tx_hash,
    };
  });

  const rowExpansionTemplate = (data) => {
    return (
      <div className="orders-subtable">
        <h6 className="py-2 pt-3">Network details</h6>
        <DataTable value={tableNetworksData} responsiveLayout="scroll">
          <Column
            field="tx_hash"
            header="Tx hash"
            style={{ width: "90%" }}
          ></Column>
          <Column style={{ width: "10%" }} body={searchBodyTemplate}></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <div className="container-md mt-5 verification-section">
      <div className=" horizontal-center timeline-margins mb-5 stepper">
        <div className="bold-text header-title mb-4 mt-4">
          Your verification:
        </div>
        <Timeline
          value={events}
          layout="horizontal"
          content={customizedContent}
          marker={customizedMarker}
          className="px-5"
        />
      </div>
      <div className="little-top-margin"></div>
      <div className="horizontal-center">
        {successMessage ? (
          <>
            <div className="pt-4">
              <div className="d-flex flex-row justify-content-center align-items-center">
                <p className="px-2 fs-2">Done!</p>
              </div>
              <div className="bold-text">
                <h4 className="mx-2">Your document has been verified</h4>
              </div>
              <div className="pt-2">
                <Card
                  className="mt-5 px-5 py-4 border-0"
                  style={{ textAlign: "left" }}
                >
                  <div className="mb-5">
                    <i
                      className=" pi pi-copy px-1 py-1 click-icon "
                      style={{
                        color: "#495057",
                        fontSize: "1.3rem",
                        fontWeight: "100",
                      }}
                    ></i>
                    <span className="mx-2 bold-text">
                      {(selectedFile && selectedFile.name) ||
                        (acceptedFiles[0] !== undefined &&
                          acceptedFiles[0].name)}
                    </span>
                  </div>
                  <div className="bold-text">Document hash</div>
                  <div className="" style={{ overflowWrap: "break-word" }}>
                    {documentHash && documentHash}
                  </div>

                  <Divider className="my-4 pb-2" />

                  <div className="bold-text">Anchor</div>
                  <div>{isProofRetrieved.anchor.anchor_id}</div>

                  <Divider className="my-4 pb-2" />

                  <div className="bold-text">Networks</div>
                  <div className="card my-3">
                    <DataTable
                      value={tableNetworksData}
                      responsiveLayout="scroll"
                      expandedRows={expandedRows}
                      onRowToggle={(e) => setExpandedRows(e.data)}
                      rowExpansionTemplate={rowExpansionTemplate}
                      dataKey="id"
                    >
                      <Column expander style={{ width: "3em" }} />
                      <Column field="name" header="Name"></Column>
                      <Column field="state" header="State"></Column>
                      <Column field="created_at" header="Timestamp"></Column>
                    </DataTable>
                  </div>
                  <Divider className="my-4 pb-2" />
                  <div className="bold-text">Issuer</div>
                  <div>BLOOCK</div>
                </Card>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default VerificationSection;
