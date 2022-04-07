import { BloockClient, Network, Proof, Record } from "@bloock/sdk";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { Timeline } from "primereact/timeline";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "../styles.css";
import FilePreview from "./FilePreview";

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
  const [expandedRows, setExpandedRows] = useState<any>(null);

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

  console.log(element);

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

  const colors = {
    success: "#06d7be",
    error: "#F55845",
    idle: "#d7d7d7",
  };

  const events = [
    {
      status: "Retrieve integrity proof",
      description: "",
      icon:
        errorStep === 0
          ? "pi pi-times px-2 py-2 click-icon"
          : recordTimestamp == null
          ? "pi pi-check px-2 py-2 click-icon"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 0
          ? colors.error
          : recordProof == null
          ? colors.idle
          : colors.success,
    },
    {
      status: "Validate integrity proof",
      description: "",
      icon:
        errorStep === 1
          ? "pi pi-times px-2 py-2 click-icon"
          : recordProofVerified === null
          ? "pi pi-check px-2 py-2 click-icon"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 1
          ? colors.error
          : recordProofVerified === null
          ? colors.idle
          : colors.success,
    },
    {
      status: "Validate existence in blockchain",
      description: "",
      icon:
        errorStep === 2
          ? "pi pi-times px-2 py-2 click-icon"
          : recordTimestamp === null
          ? "pi pi-check px-2 py-2 click-icon"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 2
          ? colors.error
          : recordTimestamp === null
          ? colors.idle
          : colors.success,
    },
  ];

  const customizedMarker = (item: any) => {
    return (
      <span
        className="custom-marker p-shadow-2 circle"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    );
  };

  const customizedContent = (item: any) => {
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
        state: network.state,
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
    <div className="container-md mt-5 verification-section">
      <div
        className=" horizontal-center timeline-margins mb-5 stepper"
        style={{ paddingTop: "30px", paddingBottom: "70px" }}
      >
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
        {recordTimestamp && errorStep == null ? (
          <>
            <div>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <p className="px-2 fs-2">Done!</p>
              </div>
              <div className="bold-text">
                <h4 className="mx-2">Your record has been verified</h4>
              </div>
              <div className="pt-2 mb-5">
                <Card
                  className="mt-5 px-3 py-4 border-0"
                  style={{ textAlign: "left" }}
                >
                  <Row className="justify-content-between">
                    <Col md={5}>
                      <FilePreview element={element} />
                    </Col>
                    <Col md={6}>
                      <div className={fileName ? "mb-5" : "mb-0"}>
                        <i
                          className=" pi pi-file px-1 py-1 click-icon "
                          style={
                            fileName
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
                        <span className="mx-2 bold-text">{fileName}</span>
                      </div>
                      <div className="bold-text">Document hash</div>
                      <div style={{ overflowWrap: "break-word" }}>
                        {record && record.getHash()}
                      </div>

                      <Divider className="my-4 pb-2" />

                      {recordProof ? (
                        <>
                          <div className="bold-text">Anchor</div>
                          <div>{(recordProof as any).anchor.anchor_id}</div>

                          <Divider className="my-4 pb-2" />
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
                          <Column
                            field="created_at"
                            header="Timestamp"
                          ></Column>
                        </DataTable>
                      </div>
                      <Divider className="my-4 pb-2" />
                      <div className="bold-text">Issuer</div>
                      <div>BLOOCK</div>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>
          </>
        ) : null}
        {errorStep != null ? (
          <section className="container-md verification-section">
            <div className="pt-1 horizontal-center">
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

              <div className="pt-2 mb-5">
                <Card className="mt-4 px-3 py-4" style={{ textAlign: "left" }}>
                  <Row className="justify-content-between">
                    <Col md={5}>
                      <FilePreview element={element} />
                    </Col>
                    <Col md={6}>
                      <div className={fileName ? "mb-4" : "mb-0"}>
                        <i
                          className=" pi pi-file px-1 py-1 click-icon "
                          style={
                            fileName
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
                        <span className="mx-2 bold-text">{fileName}</span>
                      </div>

                      {errorStep === 0 ? (
                        <div>
                          <p className="pb-3">
                            There’s no proof of existence for this record. It
                            might have been modified unintentionally.
                          </p>
                          <p>
                            Potential error sources:
                            <ul>
                              <li>
                                - The issuer provided an altered version of the
                                record.
                              </li>
                              <li>
                                - The record was altered by a malicious third
                                party during transmission.
                              </li>
                              <li>- The record was unintentionally altered.</li>
                            </ul>
                          </p>
                          <p>
                            If you have any questions, please contact the issuer
                            of the records directly or get in touch with our
                            support.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p>
                            Potential error sources:
                            <ul>
                              <li>
                                - You were provided a fraudulent proof by the
                                issuer.
                              </li>
                              <li>
                                - Your record is still pending to be transacted
                                into a blockchain protocol by the issuer.
                              </li>
                            </ul>
                          </p>
                          <p>
                            Please try loading your record again in a few
                            minutes.
                          </p>
                        </div>
                      )}
                      <Divider className="my-4" />
                      <div className="bold-text">Document hash</div>
                      <div className="" style={{ overflowWrap: "break-word" }}>
                        {record && record.getHash()}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>
          </section>
        ) : null}
        {recordTimestamp == null && errorStep == null ? (
          <div className="progressSpinner" style={{ paddingBottom: "40px" }}>
            <ProgressSpinner style={{ color: "#06d7be" }} />
            <p className="text-secondary">Your record is being verified...</p>
            <div className="mt-5">{""}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VerificationSection;
