import React from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import JSONValidation from "./JSONValidation";
import TextValidation from "./TextValidation";
import "../customstyles.css";
import listIcon from "../images/tick.png";

const FileSection = () => {
  return (
    <div className="container-lg">
      <Row className="align-items-center">
        <Col style={{ paddingRight: "50px" }}>
          <h1 className="bold-text title">
            Easy validation of blockchain data records
          </h1>
          <h3 className="mt-4">
            Open source protocol to validate in seconds if your data has been
            recorded in blockchain.{" "}
          </h3>
          <ul className="mt-4">
            <li className="mt-2">
              <img
                alt="list-item"
                src={listIcon}
                width={"30px"}
                style={{ marginRight: "6px" }}
              />
              <p>Simple and easy to use</p>
            </li>
            <li className="mt-2">
              <img
                alt="list-item"
                src={listIcon}
                width={"30px"}
                style={{ marginRight: "6px" }}
              />
              <p>Inmediate results in just seconds</p>
            </li>
            <li className="mt-2">
              <img
                alt="list-item"
                src={listIcon}
                width={"30px"}
                style={{ marginRight: "6px" }}
              />
              <p>Completely transparent and open source</p>
            </li>
          </ul>
        </Col>
        <Col>
          <Tabs justify defaultActiveKey="text" className="mb-3">
            <Tab eventKey="text" title="Text format">
              <TextValidation />
            </Tab>
            <Tab eventKey="json" title="JSON format">
              <JSONValidation />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default FileSection;
