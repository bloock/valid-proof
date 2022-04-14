import { BloockClient, Network, Proof, Record } from "@bloock/sdk";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FileElement } from "../../pages/Home";
import "../../styles.css";
import FilePreview from "../documents/FilePreview";
import StepperVerification from "../elements/Stepper";
import VerificationError from "./Error";
import VerificationSuccess from "./Success";

const apiKey = (window as any).env.API_KEY;
const client = new BloockClient(apiKey);

const colors = {
  success: "#06d7be",
  error: "#F55845",
  idle: "#d7d7d7",
};

type VerificationSectionProps = {
  element: FileElement;
};

const VerificationSection: React.FC<VerificationSectionProps> = ({
  element,
}) => {
  const [recordProof, setRecordProof] = useState<Proof | null>(null);
  const [recordProofVerified, setRecordProofVerified] = useState<
    boolean | null
  >(null);
  const [recordTimestamp, setRecordTimestamp] = useState<number | null>(null);
  const [errorStep, setErrorStep] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  function getRandomInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(() => {
    setErrorStep(null);
    setRecordProof(null);
    setRecordProofVerified(null);
    setRecordTimestamp(null);
  }, [element]);

  useEffect(() => {
    const getProof = async () => {
      if (element) {
        try {
          const proof = await client.getProof([element.record as Record]);
          if (proof != null) {
            setActiveStep(0);
            setRecordProof(proof);
          } else {
            setErrorStep(0);
          }
        } catch (e) {
          setErrorStep(0);
        }
      }
    };

    setTimeout(() => getProof(), getRandomInterval(2000, 3000));
  }, [element]);

  useEffect(() => {
    const verifyProof = async () => {
      if (recordProof != null) {
        try {
          const record = await client.verifyProof(recordProof);
          if (record) {
            setActiveStep(1);

            setRecordProofVerified(true);
          } else {
            setErrorStep(1);
          }
        } catch (e) {
          setErrorStep(1);
        }
      }
    };

    setTimeout(() => {
      verifyProof();
    }, getRandomInterval(1000, 2000));
  }, [recordProof]);

  useEffect(() => {
    const getRecordTimestamp = async () => {
      debugger;

      if (recordProofVerified != null) {
        try {
          let recordNetwork = (recordProof as any).anchor.networks[0];
          let network = Network.ETHEREUM_MAINNET;
          switch (recordNetwork.name) {
            case "ethereum_mainnet":
              network = Network.ETHEREUM_MAINNET;
              break;
            case "ethereum_rinkeby":
              network = Network.ETHEREUM_RINKEBY;
              break;
            case "bloock_chain":
              network = Network.BLOOCK_CHAIN;
              break;
          }

          const timestamp = await client.validateRoot(
            element.record as Record,
            network
          );
          if (timestamp !== 0 && timestamp !== null) {
            setActiveStep(2);
            setRecordTimestamp(timestamp);
          } else {
            setErrorStep(2);
          }
        } catch (e) {
          setErrorStep(2);
        }
      }
    };

    setTimeout(() => {
      getRecordTimestamp();
    }, getRandomInterval(1000, 2000));
  }, [recordProofVerified]);

  const events = [
    {
      status: "Retrieve integrity proof",
      icon:
        errorStep === 0
          ? "pi pi-times px-2 py-2 click-icon"
          : !activeStep && activeStep !== 0
          ? "pi pi-check px-2 py-2 click-icon pi pi-spin pi-spinner"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 0
          ? colors.error
          : !activeStep && activeStep !== 0
          ? colors.idle
          : colors.success,
    },
    {
      status: "Validate integrity proof",
      icon:
        errorStep === 1
          ? "pi pi-times px-2 py-2 click-icon"
          : activeStep !== 1 && errorStep !== 0
          ? "pi pi-check px-2 py-2 click-icon pi pi-spin pi-spinner"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 1
          ? colors.error
          : activeStep !== 1
          ? colors.idle
          : colors.success,
    },
    {
      status: "Validate existence in blockchain",
      icon:
        errorStep === 2
          ? "pi pi-times px-2 py-2 click-icon"
          : activeStep !== 2 && errorStep !== 0 && errorStep !== 1
          ? "pi pi-check px-2 py-2 click-icon pi pi-spin pi-spinner"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 2
          ? colors.error
          : activeStep !== 2
          ? colors.idle
          : colors.success,
    },
  ];

  return (
    <div className="container-lg mt-5 verification-section">
      <div
        className=" horizontal-center timeline-margins mb-5 stepper bg-light"
        style={{ paddingTop: "30px", paddingBottom: "40px" }}
      >
        <div className="bold-text header-title j mb-4 mt-4">
          Your verification:
        </div>
        <StepperVerification events={events} />
      </div>
      <div className="little-top-margin"></div>
      <div className="horizontal-center">
        {recordTimestamp == null && errorStep == null ? null : (
          <div className="pt-2 mb-5 animated fadeIn">
            {recordTimestamp && errorStep == null ? (
              <div>
                <div className="d-flex flex-row justify-content-center align-items-center">
                  <p className="px-2 fs-2">Done!</p>
                </div>
                <div className="bold-text">
                  <h4 className="mx-2">Your record has been verified</h4>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    <p className="px-2 fs-2">Oops!</p>
                  </div>
                  {errorStep === 0 ? (
                    <div className="bold-text">
                      <h4 className="mx-2">Your record couldn't be verified</h4>
                    </div>
                  ) : (
                    <div className="bold-text">
                      <h4 className="mx-2">
                        The digest of the retrieved proof couldn't be found in
                        any blockchain protocol.
                      </h4>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div
              className="mt-5 py-4 border-0 bg-light 5 verification-container"
              style={{ textAlign: "left" }}
            >
              <Row className="justify-content-between pt-3 pb-3 ">
                <Col lg={5} className="mb-4">
                  <FilePreview element={element} />
                </Col>
                <Col lg={6} className="mb-4 mt-2">
                  {recordTimestamp && errorStep === null ? (
                    <VerificationSuccess
                      element={element}
                      recordProof={recordProof}
                    />
                  ) : (
                    <VerificationError
                      element={element}
                      errorStep={errorStep}
                    />
                  )}
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationSection;
