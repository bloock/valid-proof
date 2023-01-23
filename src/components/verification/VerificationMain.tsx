import {
  AesDecrypter,
  Bloock,
  BloockClient,
  Network,
  Proof,
  RecordBuilder,
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

/* Bloock.setApiKey((window as any).env.API_KEY);
 */

Bloock.setApiHost("https://api.bloock.dev");
Bloock.setProvider(Network.BLOOCK_CHAIN, "https://ganache.bloock.dev");
Bloock.setApiKey(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzQ2NTU4NTYsIm5iZiI6MTY3NDA1MTA1NiwiaWF0IjoxNjc0MDUxMDU2LCJjbGllbnRfaWQiOiJlMTdlYTcyZS0yZmQ0LTRhZDktYThkNi1mOWMwODI5N2ZiMDYiLCJwcm9kdWN0IjpbeyJpZCI6InByb2RfTWxJZjdYSFFiVWk0TGciLCJtZXRhZGF0YSI6eyJpbnRlcnZhbCI6Im1vbnRobHkiLCJsaWNlbnNlIjoiIiwibmFtZSI6IkNlcnRpZmljYXRpb25zIC0gQmFzaWMgLSBNb250aGx5Iiwib3B0aW9uYWwiOiIwIiwicGxhbiI6ImJhc2ljIiwicHJpdmF0ZSI6IiIsInByb2R1Y3RfdHlwZSI6ImNlcnRpZmljYXRpb25zIn19LHsiaWQiOiJwcm9kX01sSk5BY3dZSDdNakxsIiwibWV0YWRhdGEiOnsiaW50ZXJ2YWwiOiJtb250aGx5IiwibGljZW5zZSI6IiIsIm5hbWUiOiJEYXRhIEF2YWlsYWJpbGl0eSAtIEJhc2ljIC0gTW9udGhseSIsIm9wdGlvbmFsIjoiMCIsInBsYW4iOiJiYXNpYyIsInByaXZhdGUiOiIiLCJwcm9kdWN0X3R5cGUiOiJkYXRhX2F2YWlsYWJpbGl0eSJ9fSx7ImlkIjoicHJvZF9NbEszQzVsVG1FRW5qYyIsIm1ldGFkYXRhIjp7ImludGVydmFsIjoibW9udGhseSIsImxpY2Vuc2UiOiIiLCJuYW1lIjoiTm9kZXMgLSBCYXNpYyAtIE1vbnRobHkiLCJvcHRpb25hbCI6IjAiLCJwbGFuIjoiYmFzaWMiLCJwcml2YXRlIjoiIiwicHJvZHVjdF90eXBlIjoibm9kZXMifX1dLCJ1c2VyIjp7Im5hbWUiOiJFZHVhcmQiLCJzdXJuYW1lIjoiVG9tYXMiLCJlbWFpbCI6ImVkdWFyZEBibG9vY2suY29tIiwiYWN0aXZhdGVkIjp0cnVlLCJ2ZXJpZmllZCI6dHJ1ZX0sInNjb3BlcyI6eyJjb3JlLXRlc3QuYW5jaG9yIjpbInJlYWQiXSwiY29yZS10ZXN0Lm1lc3NhZ2UiOlsicmVhZCIsImNyZWF0ZSJdLCJjb3JlLXRlc3QucHJvb2YiOlsicmVhZCJdLCJjb3JlLmFuY2hvciI6WyJyZWFkIl0sImNvcmUubWVzc2FnZSI6WyJyZWFkIiwiY3JlYXRlIl0sImNvcmUucHJvb2YiOlsicmVhZCJdLCJjcmVkZW50aWFscy10ZXN0LmFwaUtleSI6WyJjcmVhdGUiLCJyZWFkIiwidXBkYXRlIiwiZGVsZXRlIl0sImNyZWRlbnRpYWxzLmFwaWtleSI6WyJjcmVhdGUiLCJyZWFkIiwidXBkYXRlIiwiZGVsZXRlIl0sImNyZWRlbnRpYWxzLnNlc3Npb24iOlsidXBkYXRlIl0sImRhdGEtYXZhaWxhYmlsaXR5LnVwbG9hZCI6WyJjcmVhdGUiXSwiZXZlbnRzLmFjdGl2aXR5IjpbInJlYWQiXSwiZXZlbnRzLmFuY2hvciI6WyJyZWFkIl0sImV2ZW50cy53ZWJob29rIjpbInJlYWQiXSwibm9kZS1wcm94eS5yZWRpcmVjdCI6WyJyZWFkIl0sIm5vdGlmaWNhdGlvbnMuZmVlZGJhY2siOlsiY3JlYXRlIl0sIm5vdGlmaWNhdGlvbnMud2ViaG9vayI6WyJjcmVhdGUiLCJyZWFkIiwidXBkYXRlIiwiZGVsZXRlIl0sInN1YnNjcmlwdGlvbnMuaW52b2ljZSI6WyJyZWFkIl0sInN1YnNjcmlwdGlvbnMucGxhbiI6WyJyZWFkIiwidXBkYXRlIl0sInN1YnNjcmlwdGlvbnMuc3Vic2NyaXB0aW9uIjpbInJlYWQiLCJ1cGRhdGUiLCJkZWxldGUiXSwidXNlcnMuYnVzaW5lc3MiOlsicmVhZCIsInVwZGF0ZSIsImRlbGV0ZSJdLCJ1c2Vycy5tZXRhZGF0YSI6WyJyZWFkIl0sInVzZXJzLnVzZXIiOlsicmVhZCIsInVwZGF0ZSJdfX0.iV0iPC_p7gBSdA4ofm5Gz93JRLj-o9bgHPqx3CFVUJg"
);

const client = new BloockClient();

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
  const [show, setShow] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState<string>("");
  const [recordCommonName, setRecordCommonName] = useState<string>("");
  const [uiError, setUiError] = useState<string>("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function getRandomInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const onPasswordChange = (e: any) => {
    console.log(e.target.value);
    setEncryptionPassword(e.target.value);
    setUiError("");
  };

  console.log(encryptionPassword);
  useEffect(() => {
    setErrorStep(null);
    setRecordProof(null);
    setRecordRoot(null);
    setRecordNetworks(null);
  }, [element]);

  const decryptRecord = async () => {
    if (isEncrypted && element?.record) {
      try {
        let decryptedRecord = await RecordBuilder.fromRecord(element?.record)
          .withDecrypter(new AesDecrypter(encryptionPassword))
          .build();
        console.log(decryptedRecord);
        handleClose();
      } catch (e) {
        console.log(e);
        setUiError("This password seems to be incorrect");
      }
    }
  };

  console.log(element?.record);
  useEffect(() => {
    const getRecordSignature = async () => {
      if (element?.record) {
        try {
          let signatures = await element.record.getSignatures();
          let retrievedName = await signatures[1].getCommonName();
          setRecordCommonName("Common name");
          console.log(signatures);
          console.log(retrievedName);
        } catch (e) {
          console.log(e);
        }
      }
    };
    getRecordSignature();
  }, [element]);
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
  }, [errorFetchDocument, element, isEncrypted]);

  useEffect(() => {
    const getProof = async () => {
      if (element && element.record && !isEncrypted) {
        try {
          console.log(element, await element.record.getHash());
          const proof = await client.getProof([element.record]);
          console.log(proof);
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
  }, [element]);

  useEffect(() => {
    const verifyProof = async () => {
      if (recordProof != null && !isEncrypted) {
        try {
          const root = await client.verifyProof(recordProof);
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
              }
              const timestamp = await client.validateRoot(recordRoot, network);

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
        <Modal.Header closeButton>
          <Modal.Title>Oh! Seems this file is encrypted!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please, introduce your password to decrypt the file and validate it.
          Note that if you exit the modal the validating process will be
          interrupted.
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
