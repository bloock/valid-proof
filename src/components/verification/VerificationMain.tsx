import {
  AesDecrypter,
  AuthenticityClient,
  Bloock,
  EncryptionClient,
  IntegrityClient,
  Network,
  Proof,
  Record,
  RecordClient,
} from "@bloock/sdk";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FileElement } from "../../pages/Home";
import "../../styles.css";
import FilePreview from "../documents/FilePreview";
import StepperVerification from "../elements/Stepper";
import VerificationError from "./Error";
import VerificationSuccess from "./Success";

if ((window as any).env.API_HOST) {
  Bloock.setApiHost((window as any).env.API_HOST);
}

if ((window as any).env.BLOOCKCHAIN_PROVIDER) {
  Bloock.setProvider(
    Network.BLOOCK_CHAIN,
    (window as any).env.BLOOCKCHAIN_PROVIDER
  );
}

if ((window as any).env.GOERLI_PROVIDER) {
  Bloock.setProvider(
    Network.ETHEREUM_GOERLI,
    (window as any).env.GOERLI_PROVIDER
  );
}

if ((window as any).env.BLOOCKCHAIN_CONTRACT_ADDRESS) {
  Bloock.setContractAddress(
    Network.BLOOCK_CHAIN,
    (window as any).env.BLOOCKCHAIN_CONTRACT_ADDRESS
  );
}

if ((window as any).env.GOERLI_CONTRACT_ADDRESS) {
  Bloock.setContractAddress(
    Network.ETHEREUM_GOERLI,
    (window as any).env.GOERLI_CONTRACT_ADDRESS
  );
}

Bloock.setApiKey((window as any).env.API_KEY);

const integrityClient = new IntegrityClient();
const authenticityClient = new AuthenticityClient();
const recordClient = new RecordClient();
const encryptionClient = new EncryptionClient();

const colors = {
  success: "var(--primary-bg-color)",
  error: "#F55845",
  idle: "#d7d7d7",
};

type VerificationSectionProps = {
  element: FileElement | null;
  errorFetchDocument?: boolean;
  onErrorFetchDocument: (error: boolean) => any;
};

export type RecordNetwork = {
  name: string;
  state: string;
  tx_hash: string;
  created_at: number;
};

const VerificationSection: React.FC<VerificationSectionProps> = ({
  element,
  errorFetchDocument,
  onErrorFetchDocument,
}) => {
  const { t } = useTranslation("verification");

  const [recordProof, setRecordProof] = useState<Proof | null>(null);
  const [recordRoot, setRecordRoot] = useState<string | null>(null);
  const [recordNetworks, setRecordNetworks] = useState<RecordNetwork[] | null>(
    null
  );
  const [errorStep, setErrorStep] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [componentTransition, setComponentTransition] = useState(false);
  const [hasUserAlreadyValidated, setHasUserAlreadyValidated] =
    useState<boolean>(false);
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState<string>("");
  const [recordCommonName, setRecordCommonName] = useState<string>("");
  const [recordEncryptionAlg, setRecordEncryptionAlg] = useState<any>("");
  const [decryptedRecord, setDecryptedRecord] = useState<Record | null>(null);
  const [uiError, setUiError] = useState<string>("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function getRandomInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const onPasswordChange = (e: any) => {
    setEncryptionPassword(e.target.value);
    setUiError("");
  };

  useEffect(() => {
    setErrorStep(null);
    setRecordProof(null);
    setRecordRoot(null);
    setRecordNetworks(null);
  }, [element]);

  useEffect(() => {
    const getEncryptionAlgorithm = async () => {
      if (element?.record) {
        try {
          let encryptionAlg = await encryptionClient.getEncryptionAlg(
            element.record
          );
          setRecordEncryptionAlg(encryptionAlg);
          if (encryptionAlg === 0 || encryptionAlg === 1) {
            setIsEncrypted(true);
            if (encryptionAlg === 0) {
              setRecordEncryptionAlg("A256GCM");
            } else if (encryptionAlg === 1) {
              setRecordEncryptionAlg("RSA");
            }
          } else {
            setIsEncrypted(false);
            setRecordEncryptionAlg("");
          }
        } catch (e) {
          setIsEncrypted(false);
          return;
        }
      }
    };
    getEncryptionAlgorithm();
  }, [element?.record]);

  const decryptRecord = async () => {
    if (isEncrypted && element?.record && encryptionPassword) {
      try {
        let decryptedRecord = await recordClient
          .fromRecord(element?.record)
          .withDecrypter(new AesDecrypter(encryptionPassword))
          .build();
        handleClose();
        setIsEncrypted(false);
        setDecryptedRecord(decryptedRecord);
      } catch (e) {
        console.log(e);
        setUiError("This password seems to be incorrect");
        return;
      }
    }
  };

  useEffect(() => {
    const getRecordSignature = async () => {
      if (!isEncrypted) {
        try {
          if (element?.record) {
            let signatures = await authenticityClient.getSignatures(
              element?.record
            );
            if (signatures?.length > 0) {
              setIsSigned(true);
            }

            let retrievedName = await authenticityClient.getSignatureCommonName(
              signatures[0]
            );
            let signatureAlg = signatures && signatures[0]["header"].alg;
            if (retrievedName) {
              setRecordCommonName(retrievedName);
            } else {
              setRecordCommonName(signatureAlg);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
    getRecordSignature();
  }, [element?.record, decryptedRecord, isEncrypted]);

  useEffect(() => {
    if (!isEncrypted) {
      if (errorFetchDocument) {
        setTimeout(
          () => (onErrorFetchDocument(true), setErrorStep(0), setActiveStep(0)),
          getRandomInterval(1500, 2000)
        );
      } else {
        setActiveStep(0);
      }
    } else {
      handleShow();
    }
  }, [
    errorFetchDocument,
    element,
    element?.record,
    isEncrypted,
    decryptedRecord,
  ]);

  useEffect(() => {
    const getProof = async () => {
      if (!isEncrypted && element?.record) {
        try {
          const proof = await integrityClient.getProof([
            decryptedRecord ? decryptedRecord : element?.record,
          ]);
          if (proof != null) {
            setActiveStep(1);
            setRecordProof(proof);
          } else {
            setErrorStep(1);
          }
        } catch (e) {
          console.log(e);
          setErrorStep(1);
        }
      }
    };

    setTimeout(() => getProof(), getRandomInterval(500, 1000));
  }, [decryptedRecord, isEncrypted, element?.record]);

  useEffect(() => {
    const verifyProof = async () => {
      if (recordProof != null && !isEncrypted) {
        try {
          const root = await integrityClient.verifyProof(recordProof);
          if (root) {
            setActiveStep(2);

            setRecordRoot(root);
          } else {
            setErrorStep(2);
          }
        } catch (e) {
          setErrorStep(2);
        }
      }
    };

    setTimeout(() => {
      verifyProof();
    }, getRandomInterval(500, 1000));
  }, [recordProof]);

  useEffect(() => {
    const getRecordTimestamp = async () => {
      if (recordRoot != null && recordProof && !isEncrypted) {
        try {
          let networks = [];

          for (let recordNetwork of recordProof.anchor.networks) {
            if (recordNetwork.state === "Confirmed") {
              let network = Network.ETHEREUM_MAINNET;
              switch (recordNetwork.name) {
                case "ethereum_mainnet":
                  network = Network.ETHEREUM_MAINNET;
                  break;
                case "gnosis_chain":
                  network = Network.GNOSIS_CHAIN;
                  break;
                case "bloock_chain":
                  network = Network.BLOOCK_CHAIN;
                  break;
                case "ethereum_goerli":
                  network = Network.ETHEREUM_GOERLI;
                  break;
                case "polygon_chain":
                  network = Network.POLYGON_CHAIN;
                  break;
              }
              const timestamp = await integrityClient.validateRoot(
                recordRoot,
                network
              );

              if (timestamp !== 0 && timestamp !== null) {
                networks.push({
                  name: recordNetwork.name,
                  tx_hash: recordNetwork.txHash,
                  state: recordNetwork.state,
                  created_at: timestamp,
                });
              } else {
                setErrorStep(3);
              }
            }
          }

          setRecordNetworks(networks);
          setActiveStep(3);
        } catch (e) {
          setErrorStep(3);
        }
      }
    };

    setTimeout(() => {
      getRecordTimestamp();
    }, getRandomInterval(500, 1000));
  }, [recordRoot]);

  useEffect(() => {
    if (recordNetworks || (errorStep !== null && !isEncrypted)) {
      setTimeout(() => setComponentTransition(true), 500);
    }
  }, [recordNetworks, errorStep]);

  useEffect(() => {
    if (element) {
      setHasUserAlreadyValidated(true);
    }
  }, [element, hasUserAlreadyValidated]);

  const events = [
    {
      status: t("file-step"),
      description: t("file-step-helper"),
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
      status: t("first-step"),
      description: t("first-step-helper"),
      icon:
        errorStep === 1
          ? "pi pi-times px-2 py-2 click-icon"
          : (activeStep as number) < 1 && errorStep !== 0
          ? "pi pi-check px-2 py-2 click-icon pi pi-spin pi-spinner"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 1
          ? colors.error
          : !activeStep && activeStep !== 1
          ? colors.idle
          : colors.success,
    },
    {
      status: t("second-step"),
      description: t("second-step-helper"),

      icon:
        errorStep === 2
          ? "pi pi-times px-2 py-2 click-icon"
          : (activeStep as number) < 2 && errorStep !== 0 && errorStep !== 1
          ? "pi pi-check px-2 py-2 click-icon pi pi-spin pi-spinner"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 2
          ? colors.error
          : (activeStep as number) < 2
          ? colors.idle
          : colors.success,
    },
    {
      status: t("third-step"),
      description: t("third-step-helper"),
      icon:
        errorStep === 3
          ? "pi pi-times px-2 py-2 click-icon"
          : activeStep !== 3 &&
            errorStep !== 0 &&
            errorStep !== 1 &&
            errorStep !== 2
          ? "pi pi-check px-2 py-2 click-icon pi pi-spin pi-spinner"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 3
          ? colors.error
          : activeStep !== 3
          ? colors.idle
          : colors.success,
    },
  ];

  return (
    <div className="mt-3 verification-section">
      {!componentTransition && !isEncrypted ? (
        <div
          className="horizontal-center timeline-margins mb-4 stepper bg-light rounded"
          style={{ paddingTop: "30px", paddingBottom: "20px" }}
        >
          <div className=" mb-4 mt-3">{t("wait")}</div>
          <StepperVerification events={events} />
        </div>
      ) : null}
      <div className="little-top-margin"></div>
      <div className="horizontal-center">
        {!componentTransition ? (
          null && !isEncrypted
        ) : (
          <div className="pt-2 mb-5">
            <div
              className="mt-2 border-0 bg-light verification-container"
              style={{ textAlign: "left" }}
            >
              <Row
                className={` ${
                  element?.name === ""
                    ? "justify-content-center"
                    : "justify-content-between"
                } d-flex flex-column-reverse flex-lg-row p-3 `}
              >
                {element && element?.name !== "" && !isEncrypted ? (
                  <Col lg={5} className="my-4 px-4">
                    <FilePreview element={element} />
                  </Col>
                ) : null}

                {!isEncrypted ? (
                  <Col lg={7} className="mb-4 mt-2 px-4">
                    {element &&
                    recordRoot &&
                    recordProof &&
                    recordNetworks &&
                    errorStep === null ? (
                      <VerificationSuccess
                        element={element}
                        recordRoot={recordRoot}
                        recordProof={recordProof}
                        recordNetworks={recordNetworks}
                        isRecordSigned={isSigned}
                        recordSignature={recordCommonName}
                        recordEncryptionAlg={recordEncryptionAlg}
                      />
                    ) : (
                      <VerificationError
                        element={element}
                        errorStep={errorStep}
                      />
                    )}
                  </Col>
                ) : null}
              </Row>
            </div>
          </div>
        )}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Modal.Title className="py-3">{t("decrypt-modal-title")}</Modal.Title>
          {t("decrypt-modal-body")}
          <Form>
            <Form.Group className="my-3" controlId="exampleForm.ControlInput1">
              <Form.Label className="text-sm">Password</Form.Label>
              <Form.Control onChange={onPasswordChange} type="password" />
            </Form.Group>
          </Form>
          {uiError && <Alert variant="warning">{uiError}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            style={{
              backgroundColor: "var(--primary-bg-color",
              border: "none",
            }}
            onClick={decryptRecord}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VerificationSection;
