import React, { useEffect, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Timeline } from "primereact/timeline";
import "../customstyles.css";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

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
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(() => {
    if (isProofRetrieved) {
      setInterval(() => {
        setFirstStepColor("#06d7be");
      }, getRandomInterval(1000, 1700));
    } else {
      setInterval(() => {
        setFirstStepColor("#F55845");
      }, getRandomInterval(1000, 1700));
    }
  }, [isProofRetrieved]);

  useEffect(() => {
    if (isProofRetrieved !== null) {
      setInterval(() => {
        setSecondStepColor("#06d7be");
      }, getRandomInterval(1700, 2400));
    } else if (isProofRetrieved === false && firstStepColor === "#F55845") {
      setSecondStepColor("#d7d7d7");
    }
  }, [isProofRetrieved, firstStepColor]);

  useEffect(() => {
    if (isProofValidated !== false && isProofRetrieved) {
      setInterval(() => {
        setThirdStepColor("#06d7be");
      }, getRandomInterval(2400, 3000));
    } else if (isProofRetrieved && isProofValidated === null) {
      setInterval(() => {
        setThirdStepColor("#F55845");
      }, getRandomInterval(2400, 3000));
    } else if (
      !isProofRetrieved &&
      isProofValidated === null &&
      secondStepColor === "#d7d7d7"
    ) {
      setThirdStepColor("#d7d7d7");
    }
  }, [isProofValidated, isProofRetrieved, secondStepColor]);

  useEffect(() => {
    setInterval(() => {
      if (isProofValidated && isProofRetrieved) {
        setIsSuccessMessage(true);
      } else if (
        !isProofRetrieved ||
        (isProofRetrieved && isProofValidated === null)
      ) {
        setIsErrorMessage(true);
      }
    }, getRandomInterval(3300, 4000));
  }, [isProofValidated, isProofRetrieved]);

  const events = [
    {
      status: "Retrieve integrity proof",
      description: "",
      icon:
        firstStepColor === "#d7d7d7" || firstStepColor === "#06d7be"
          ? "pi pi-check px-2 py-2 click-icon"
          : "pi pi-times px-2 py-2 click-icon",
      color: firstStepColor,
    },
    {
      status: "Validate integrity proof",
      description: "",
      icon:
        secondStepColor === "#d7d7d7" || secondStepColor === "#06d7be"
          ? "pi pi-check px-2 py-2 click-icon"
          : "pi pi-times px-2 py-2 click-icon",
      color: secondStepColor,
    },
    {
      status: "Validate blockchain registrations",
      description: "",
      icon:
        thirdStepColor === "#d7d7d7" || thirdStepColor === "#06d7be"
          ? "pi pi-check px-2 py-2 click-icon"
          : "pi pi-times px-2 py-2 click-icon",
      color: thirdStepColor,
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
        {isSuccessMessage ? (
          <>
            <div className="pt-5">
              <div className="d-flex flex-row justify-content-center align-items-center">
                <p className="px-2 fs-2">Done!</p>
              </div>
              <div className="bold-text">
                <h4 className="mx-2">Your document has been verified</h4>
              </div>
              <div className="pt-2">
                <Card className="mt-4 px-4 py-2" style={{ textAlign: "left" }}>
                  <div className="mb-5">
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
        {isErrorMessage ? (
          <section className="container-md pt-5 verification-section">
            <div className="pt-1 horizontal-center">
              <div>
                <div>
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    <p className="px-2 fs-2">Oops!</p>
                  </div>
                  <div className="bold-text">
                    <h4 className="mx-2">Your document couldn't be verified</h4>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Card className="mt-4 px-5 py-5" style={{ textAlign: "left" }}>
                  <div className="mb-5">
                    <span className="mx-2 bold-text">
                      {(selectedFile && selectedFile.name) ||
                        (acceptedFiles.length > 0 && acceptedFiles[0].name)}
                    </span>
                  </div>
                  <div>
                    <span>
                      This document is not known to us. It is possible that it
                      was modified unintentionally.
                    </span>
                    <p>
                      Potential error sources:
                      <ul>
                        <li>
                          - The issuer distributed the wrong version of the
                          document.
                        </li>
                        <li>
                          - The document owner sent you the wrong version of the
                          document.
                        </li>
                        <li>
                          - The file was unintentionally altered: by printing it
                          as a PDF by saving it with a PDF writer that ignored
                          the protection by printing and scanning it.
                        </li>
                      </ul>
                    </p>
                    <span>
                      If you have any questions, please contact the issuer of
                      the document directly or get in touch with our support.
                    </span>
                  </div>
                  <Divider className="my-4" />
                  <div className="bold-text">Document hash</div>
                  <div className="" style={{ overflowWrap: "break-word" }}>
                    {documentHash && documentHash}
                  </div>
                </Card>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default VerificationSection;
