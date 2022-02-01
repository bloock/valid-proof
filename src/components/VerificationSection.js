import React, { useEffect, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Timeline } from "primereact/timeline";
import "../customstyles.css";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import FileSection from "./FileSection";

const VerificationSection = ({
  isProofRetrieved,
  isProofValidated,
  isBlockchainRegistrated,
  selectedFile,
  documentHash,
  date,
}) => {
  const events = [
    {
      status: "Retrieve integrity proof",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: isProofRetrieved ? "#06d7be" : "#d94c12",
    },
    {
      status: "Validate integrity proof",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: isProofValidated ? "#06d7be" : "#d94c12",
    },
    {
      status: "Validate blockchain registrations",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: isProofValidated ? "#06d7be" : "#d94c12",
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
        {isProofRetrieved !== null ? (
          <>
            <div className="pt-4">
              <div className="d-flex flex-row justify-content-center align-items-center">
                <p className="px-2 fs-2">Done!</p>
              </div>
              <div className="bold-text">
                <h4 className="mx-2">Your document has been verified</h4>
              </div>

              <div className="pt-2">
                <Card className="mt-4 px-4 py-2" style={{ textAlign: "left" }}>
                  <div>
                    {/*  <span>
                      <i className="pi pi-file"></i>
                    </span> */}
                    <span className="mx-2 bold-text">
                      {selectedFile && selectedFile.name}
                    </span>
                  </div>
                  <div className="bold-text">Document hash</div>
                  <div className="" style={{ overflowWrap: "break-word" }}>
                    {documentHash && documentHash}
                  </div>
                  <Divider className="my-4 pb-2" />
                  <div className="bold-text mt-4">Blockchain:</div>

                  <div>{isProofRetrieved.anchor.networks[0].name}</div>
                  <Divider className="my-4 pb-2" />
                  <div className="bold-text">Tx hash</div>
                  <div className="" style={{ overflowWrap: "break-word" }}>
                    {isProofRetrieved.anchor.networks[0].tx_hash}
                  </div>
                  <Divider className="my-4 pb-2" />

                  <div className="bold-text mt-4">Issue time</div>
                  <div>{date && date}</div>
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
