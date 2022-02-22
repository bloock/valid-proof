import React, { useEffect, useMemo, useState } from "react";
import { BloockClient, Network, Record } from "@bloock/sdk";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import "../customstyles.css";
import { useDropzone } from "react-dropzone";
import VerificationSection from "./VerificationSection";
import { Divider } from "primereact/divider";
import moment from "moment";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  height: "250px",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const FileSection = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [recordProof, setRecordProof] = useState(null);
  const [recordTimestamp, setRecordTimestamp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [droppedFile, setDroppedFile] = useState([]);
  const [formData, setFormData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCatched, setErrorCatched] = useState(null);
  const [isJSONValidated, setIsJSONValidated] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFileParsed, setIsFileParsed] = useState(false);

  const { isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: "image/*",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const handleDeleteSelected = () => {
    setCurrentRecord(null);
    setRecordProof(null);
    setRecordTimestamp(null);
    setErrorCatched(null);
    setSelectedFile(null);
    setErrorMessage("");
    setFormData("");
    setIsJSONValidated(false);
    setDroppedFile([]);
    acceptedFiles.length = 0;
    acceptedFiles.splice(0, acceptedFiles.length);
  };

  function validateJSON(item) {
    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }
    return true;
  }

  async function handleJSONSubmit(e) {
    setFormData(e.target.value);
  }
  useEffect(() => {
    if (isJSONValidated || formData.length < 1) {
      setIsError(false);
    } else {
      setIsError(true);
    }
    if (validateJSON(formData)) {
      setCurrentRecord([Record.fromObject(JSON.parse(formData))]);
    }
  }, [formData, isJSONValidated]);

  useEffect(() => {
    setIsJSONValidated(validateJSON(formData));
  }, [formData]);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      if (file) {
        fileReader.readAsDataURL(file);
      }
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  async function handleFileSubmit(e) {
    setSelectedFile(e.target.files[0]);
  }

  useEffect(() => {
    async function parseFile() {
      if (selectedFile && selectedFile !== undefined) {
        const base64File = await convertBase64(selectedFile);
        setCurrentRecord([Record.fromString(base64File)]);
        setIsFileParsed(true);
      }
    }
    parseFile();
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile && isFileParsed === false) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [selectedFile, isFileParsed]);

  async function validateData() {
    setIsLoading(true);
    /*     const apiKey = window.env.BLOOCK_API_KEY;
     */

    const apiKey =
      "7cz2yPqLtWx7EkQwCim8bd15uSkiU9SvaGXvBJDYebjVO27w5xvWTdv-82Uo75rQ";
    const client = new BloockClient(apiKey);

    //Get proof
    try {
      const proof = await client.getProof(currentRecord);
      setRecordProof(proof);
      console.log(proof);

      //Verify proof
      const timestamp = await client.verifyProof(
        proof,
        Network.ETHEREUM_RINKEBY
      );
      setRecordTimestamp(timestamp);

      if (timestamp) {
        console.log(`Record is valid - Timestamp: ${timestamp}`);
      } else {
        console.log(`Record is invalid`);
      }
    } catch (error) {
      setErrorCatched(error);
      console.log(error);
    }
  }

  useEffect(() => {
    async function parseDropdown() {
      if (acceptedFiles && acceptedFiles !== []) {
        const base64File = await convertBase64(acceptedFiles[0]);
        setCurrentRecord([Record.fromString(base64File)]);
      }
    }
    parseDropdown();
  }, [acceptedFiles]);

  useEffect(() => {
    (recordTimestamp || errorCatched) && setIsLoading(false);
  }, [recordTimestamp, errorCatched]);

  let unix_timestamp =
    recordProof !== null && recordProof.anchor.networks[0].created_at;
  const date = moment(unix_timestamp * 1000).format("DD-MM-YYYY HH:mm:ss");
  const documentHash = currentRecord && currentRecord[0].getHash();

  useEffect(() => {
    errorCatched &&
      setErrorMessage(
        <section className="container-md pt-6 verification-section">
          <div className="pt-1 horizontal-center">
            <div>
              {currentRecord ? (
                <div>
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    <p className="px-2 fs-2">Oops!</p>
                  </div>
                  <div className="bold-text">
                    <h4 className="mx-2">Your document couldn't be verified</h4>
                  </div>
                </div>
              ) : null}
            </div>
            {currentRecord ? (
              <div className="pt-2">
                <Card className="mt-4 px-5 py-5" style={{ textAlign: "left" }}>
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
            ) : null}
          </div>
        </section>
      );
  }, [
    errorCatched,
    currentRecord,
    formData,
    selectedFile,
    documentHash,
    acceptedFiles,
  ]);

  return (
    <div className="container-md">
      <Row className="flex-column flex-lg-row align-items-center pt-8">
        <Col style={{ paddingRight: "50px", marginBottom: "30px" }}>
          <h1 className="bold-text title">
            Easy validation of blockchain data records
          </h1>
          <h3 className="mt-4">
            Open source protocol to validate in seconds if your data has been
            recorded in blockchain.{" "}
          </h3>
          <ul className="mt-4">
            <li className="mt-2">
              <i
                className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                style={{ marginRight: "10px", backgroundColor: "#06D7BE" }}
              ></i>
              <p>Simple and easy to use</p>
            </li>
            <li className="mt-3">
              <i
                className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                style={{ marginRight: "10px", backgroundColor: "#06D7BE" }}
              ></i>

              <p>Inmediate results in just seconds</p>
            </li>
            <li className="mt-3">
              <i
                className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                style={{ marginRight: "10px", backgroundColor: "#06D7BE" }}
              ></i>

              <p>Completely transparent and open source</p>
            </li>
          </ul>
        </Col>
        <Col className="mb-10" style={{ marginBottom: "30px" }}>
          <Tabs justify defaultActiveKey="text" className="mb-3 ">
            <Tab eventKey="text" title="File format">
              <section>
                <div className="container" {...getRootProps({ style })}>
                  <div className="vertical-center horizontal-center">
                    <div>
                      {currentRecord ? (
                        <div>
                          {!recordTimestamp && !errorMessage ? (
                            <div>
                              <span>
                                {" "}
                                {selectedFile && selectedFile !== undefined
                                  ? selectedFile.name
                                  : null}{" "}
                                {acceptedFiles && acceptedFiles.length > 0
                                  ? acceptedFiles[0].name
                                  : null}{" "}
                              </span>
                              <span onClick={handleDeleteSelected}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="currentColor"
                                  class="bi bi-x"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                </svg>
                              </span>
                            </div>
                          ) : null}

                          <div className="mt-3">
                            {isLoading ? (
                              <button
                                className="button"
                                style={{ border: "none" }}
                              >
                                Loading...
                              </button>
                            ) : (
                              <div>
                                {recordTimestamp || errorCatched ? (
                                  <button
                                    className="button"
                                    onClick={handleDeleteSelected}
                                    style={{ border: "none" }}
                                  >
                                    Validate another file
                                  </button>
                                ) : (
                                  <button
                                    className="button"
                                    onClick={validateData}
                                    style={{ border: "none" }}
                                    type="submit"
                                  >
                                    Validate file
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p>Drag and drop your file</p>
                          <p>or</p>

                          <div className="button mt-1">
                            <input
                              className=""
                              type="file"
                              name="file"
                              id="file"
                              onChange={handleFileSubmit}
                            />
                            <label for="file">Select file</label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </Tab>
            <Tab eventKey="json" title="JSON format">
              <div>
                <div className="mb-3 d-flex flex-column align-items-center">
                  <Form.Control
                    as="textarea"
                    placeholder="Paste your JSON here"
                    rows={10}
                    value={formData}
                    onChange={(e) => handleJSONSubmit(e)}
                  />

                  {isError ? (
                    <div>
                      <br />
                      <p>
                        {" "}
                        Please introduce a valid JSON for the validation{" "}
                      </p>{" "}
                    </div>
                  ) : null}

                  {isLoading ? (
                    <button className="button" style={{ border: "none" }}>
                      Loading...
                    </button>
                  ) : (
                    <div>
                      {recordTimestamp || errorCatched ? (
                        <button
                          className="button mt-3"
                          onClick={handleDeleteSelected}
                          style={{ border: "none" }}
                        >
                          Validate another JSON
                        </button>
                      ) : (
                        <button
                          className="button mt-3 validateButton"
                          style={{ border: "none" }}
                          onClick={validateData}
                          type="submit"
                          disabled={isJSONValidated === false}
                        >
                          Validate JSON
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {recordProof !== null ? (
        <div>
          <VerificationSection
            selectedFile={selectedFile}
            date={date}
            documentHash={documentHash}
            isBlockchainRegitrated={recordTimestamp}
            isProofRetrieved={recordProof}
            isProofValidated={recordTimestamp}
            acceptedFiles={acceptedFiles}
          />
        </div>
      ) : (
        <div> {errorMessage} </div>
      )}
    </div>
  );
};

export default FileSection;
