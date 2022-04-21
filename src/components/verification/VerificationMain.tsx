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
  element: FileElement | null;
};

const VerificationSection: React.FC<VerificationSectionProps> = ({
  element,
}) => {
  const [recordProof, setRecordProof] = useState<Proof | null>(null);
  const [recordRoot, setRecordRoot] = useState<Record | null>(null);
  const [recordTimestamp, setRecordTimestamp] = useState<number | null>(null);
  const [errorStep, setErrorStep] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  function getRandomInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(() => {
    setErrorStep(null);
    setRecordProof(null);
    setRecordRoot(null);
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

            setRecordRoot(record);
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
      if (recordRoot != null) {
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
            recordRoot as Record,
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
  }, [recordRoot]);

  const events = [
    {
      status: "Getting tamper proof seal",
      description: "Step 1",
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
      status: "Validating seal verity",
      description: "Step 2",

      icon:
        errorStep === 1
          ? "pi pi-times px-2 py-2 click-icon"
          : (activeStep as number) < 1 && errorStep !== 0
          ? "pi pi-check px-2 py-2 click-icon pi pi-spin pi-spinner"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 1
          ? colors.error
          : (activeStep as number) < 1
          ? colors.idle
          : colors.success,
    },
    {
      status: "Searching seal in blockchain",
      description: "Step 3",

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
        className="horizontal-center timeline-margins mb-4 stepper bg-light rounded"
        style={{ paddingTop: "30px", paddingBottom: "20px" }}
      >
        <div className=" mb-4 mt-3">
          Please wait for your file to be verified
        </div>
        <StepperVerification events={events} />
      </div>
      <div className="little-top-margin"></div>
      <div className="horizontal-center">
        {recordTimestamp == null && errorStep == null ? null : (
          <div className="pt-2 mb-5 animated fadeIn">
            <div
              className="mt-2 border-0 bg-light 5 verification-container"
              style={{ textAlign: "left" }}
            >
              <Row className="justify-content-between d-flex flex-column-reverse p-3 ">
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
