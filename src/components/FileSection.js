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
  const [isLoading, setIsLoading] = useState(false);

  //JSON validator
  const [formData, setFormData] = useState("");
  const validateData = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  //text validator

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

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [getProof, setGetProof] = useState([]);
  const [getRecord, setGetRecord] = useState([]);
  const [isError, setIsError] = useState(false);

  let stringFromUrl = "";

  async function handleSubmit() {
    setIsLoading(true);
    validateData(formData) === true
      ? console.log(formData, "JSON validated to be sent")
      : console.log("No JSON data ready");

    function toDataURL(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    }

    await toDataURL(selectedFile, function (url) {
      stringFromUrl = url;
    });

    const apiKey =
      "test_7XVZZd0O3Nc164DQRxc3MkCkbXRcEq7od4R-WDOdWppXA4rgGEmvT24-BurHkrri";
    const data = { prova: "Holas" };

    const client = new BloockClient(apiKey);
    /*     const data = stringFromUrl*/

    const records = [Record.fromObject(data)];
    setGetRecord(records);
    console.log(records, "records");

    //set up networks
    client.setApiHost("https://api.bloock.dev");

    client.setNetworkConfiguration(Network.BLOOCK_CHAIN, {
      CONTRACT_ADDRESS: "d2d1BBcbee7741f8C846826F55b7c17fc5cf969a",

      CONTRACT_ABI:
        '[{"inputs":[{"internalType":"address","name":"role_manager","type":"address"},{"internalType":"address","name":"state_manager","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"STATE_MANAGER","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"state_root","type":"bytes32"}],"name":"getState","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"state_root","type":"bytes32"}],"name":"isStatePresent","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"state_root","type":"bytes32"}],"name":"updateState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"content","type":"bytes32[]"},{"internalType":"bytes32[]","name":"hashes","type":"bytes32[]"},{"internalType":"bytes","name":"bitmap","type":"bytes"},{"internalType":"uint32[]","name":"depths","type":"uint32[]"}],"name":"verifyInclusionProof","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]',

      HTTP_PROVIDER: "https://bloockchain.bloock.dev",
    });

    /*   // send data
    console.time("SEND_DATA");
  const sendReceipt = await client.sendRecords([records]);
  console.timeEnd("SEND_DATA");

  console.log(sendReceipt);

  console.time("WAIT_DATA");
  let anchor = await client.waitAnchor(sendReceipt[0].anchor, 3000);
  console.log(anchor);
  console.timeEnd("WAIT_DATA"); */

    //Get proof
    try {
      const proof = await client.getProof(records);
      setGetProof([proof]);
      console.log(proof);

      //Verify proof
      let timestamp = await client.verifyProof(proof, Network.BLOOCK_CHAIN);
      console.log(timestamp);
      if (timestamp) {
        console.log(`Record is valid - Timestamp: ${timestamp}`);
      } else {
        console.log(`Record is invalid`);
      }
    } catch (error) {
      setIsError(true)
      console.log(error);
    }

    setTimeout(() => {
      setIsFilePicked(false);
    }, 500);
  }

  const handleChange = (e) => {
    setFormData(e.target.value);
    setSelectedFile(e.target.files[0]);
    setIsFilePicked(true);
  };

  const handleDeleteSelected = (e) => {
    setIsFilePicked(false);
  };

  let unix_timestamp =
    getProof[0] !== undefined &&
    getProof[0]["anchor"]["networks"][0]["created_at"];
  var date = new Date(unix_timestamp).toLocaleDateString("en-US");
  let documentHash = getRecord[0] !== undefined && getRecord[0].getHash();

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
            <Tab eventKey="text" title="Text format">
              <section>
                <div className="container" {...getRootProps({ style })}>
                  <div className="vertical-center horizontal-center">
                    <div>
                      {isFilePicked || acceptedFiles.length > 0 ? (
                        <div>
                          <span>
                            {" "}
                            {selectedFile
                              ? selectedFile.name
                              : acceptedFiles[0].name}{" "}
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

                          <div className="mt-3">
                            {isLoading ? (
                              <button
                                className="button"
                                onClick={handleSubmit}
                                style={{ border: "none" }}
                              >
                                Loading...
                              </button>
                            ) : (
                              <button
                                className="button"
                                onClick={handleSubmit}
                                style={{ border: "none" }}
                              >
                                Validate file
                              </button>
                            )}
                          </div>

                          <i
                            className="bi bi-x bi-4x"
                            onClick={handleDeleteSelected}
                          ></i>
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
                              onChange={handleChange}
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
                    onChange={handleChange}
                  />
                  <button
                    className="button mt-3"
                    style={{ width: "30%", border: "none" }}
                    onClick={handleSubmit}
                  >
                    Validate JSON
                  </button>
                </div>
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {selectedFile && getProof[0] !== undefined ? (
        <div>
          {isError ? (
            "Error validating!"
          ) : (
            <VerificationSection
              selectedFile={selectedFile}
              date={date}
              getProof={getProof}
              documentHash={documentHash}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default FileSection;
