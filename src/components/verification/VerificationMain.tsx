import { BloockClient, Network, Proof, Record } from "@bloock/sdk";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import { ProgressSpinner } from "primereact/progressspinner";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "../../styles.css";
import FilePreview from "../FilePreview";
import VerificationError from "./Error";
import StepperVerification from "./Stepper";
import VerificationSuccess from "./Success";

type VerificationSectionProps = {
  record: Record;
  fileName: string | null;
  element: any;
};

const apiKey = (window as any).env.API_KEY;
const client = new BloockClient(apiKey);

const VerificationSection: React.FC<VerificationSectionProps> = ({
  record,
  fileName,
  element,
}) => {
  const [recordProof, setRecordProof] = useState<Proof | null>(null);
  const [recordProofVerified, setRecordProofVerified] = useState<
    boolean | null
  >(null);
  const [recordTimestamp, setRecordTimestamp] = useState<number | null>(null);
  const [errorStep, setErrorStep] = useState<number | null>(null);

  function getRandomInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(() => {
    setErrorStep(null);
    setRecordProof(null);
    setRecordProofVerified(null);
    setRecordTimestamp(null);
  }, [record]);

  useEffect(() => {
    const getProof = async () => {
      if (record) {
        try {
          const proof = await client.getProof([record]);
          if (proof != null) {
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
  }, [record]);

  useEffect(() => {
    const validateRecordProof = async () => {
      if (recordProof != null) {
        setRecordProofVerified(true);
      }
    };
    setTimeout(() => {
      validateRecordProof();
    }, getRandomInterval(1000, 2000));
  }, [recordProof]);

  useEffect(() => {
    const getRecordTimestamp = async () => {
      if (recordProof != null) {
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

          const timestamp = await client.verifyProof(recordProof, network);
          if (timestamp > 0) {
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

  return (
    <div className="container-lg mt-5 verification-section">
      <div
        className=" horizontal-center timeline-margins mb-5 stepper"
        style={{ paddingTop: "30px", paddingBottom: "70px" }}
      >
        <div className="bold-text header-title mb-4 mt-4">
          Your verification:
        </div>
        <StepperVerification
          errorStep={errorStep}
          recordTimestamp={recordTimestamp}
          recordProof={recordProof}
          recordProofVerified={recordProofVerified}
        />
      </div>
      <div className="little-top-margin "></div>
      <div className="horizontal-center">
        {recordTimestamp == null && errorStep == null ? (
          <div className="progressSpinner" style={{ paddingBottom: "40px" }}>
            <ProgressSpinner style={{ color: "#06d7be" }} />
            <p className="text-secondary">Your record is being verified...</p>
            <div className="mt-5">{""}</div>
          </div>
        ) : (
          <div className="pt-2 mb-5">
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
              className="mt-5 py-4 border-0 bg-light verification-container"
              style={{ textAlign: "left" }}
            >
              <Row className="justify-content-between pt-3 pb-3">
                <Col lg={5} className="mb-4">
                  <FilePreview element={element} />
                </Col>
                <Col lg={6} className="mb-4 mt-2">
                  {recordTimestamp && errorStep === null ? (
                    <VerificationSuccess
                      fileName={fileName}
                      record={record}
                      recordProof={recordProof}
                    />
                  ) : (
                    <VerificationError
                      fileName={fileName}
                      record={record}
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
