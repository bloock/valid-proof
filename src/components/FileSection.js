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


const FileSection = () => {
  return (
    <div className="container-md">
      <Row className="flex-column flex-lg-row align-items-center pt-8">
        <Col  style={{ paddingRight: "50px", marginBottom:"30px"}}>
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
        <Col className="mb-10" style={{ marginBottom:"30px"}} >
          <Tabs justify defaultActiveKey="text" className="mb-3 ">
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
