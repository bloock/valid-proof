import React from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import demoimage1 from "../images/howitworks-1.jpg";
import demoimage2 from "../images/howitworks-2.jpg";
import demoimage3 from "../images/howitworks-3.jpg";
import "../customstyles.css";

const HowItWorksSection = () => {
  return (
    <div className="bg-light">
      <div className="container-lg pt-10">
        <h2 className="bold-text title mb-5 text-center pt-5">How it works</h2>
        <Row>
          <Col>
            <h4 className="bold-text">Select your proof type</h4>
            <div className="mb-4">
              Select if you want text format or if you have the data in JSON.
            </div>
            <img
              alt="Card"
              src={demoimage1}
              style={{ width: "400px" }}
              className="shadow-sm p-3 mb-5 bg-body rounded"
            />
          </Col>
          <Col>
            <h4 className="bold-text">Load your proof</h4>
            <div className="mb-4">
              Select from your system the proof to load and the system will
              automatically check its validation.
            </div>
            <img
              alt="Card"
              src={demoimage2}
              style={{ width: "400px" }}
              className="shadow-sm p-3 mb-5 bg-body rounded"
            />
          </Col>
          <Col>
            <h4 className="bold-text">Get your results</h4>
            <div className="mb-4">
              Obtain the validation status of your proof identification.
            </div>
            <img
              alt="Card"
              src={demoimage3}
              style={{ width: "400px" }}
              className="shadow-sm p-3 mb-5 bg-body rounded"
            />
          </Col>
        </Row>
        <Row className="little-top-margin"></Row>
      </div>
    </div>
  );
};

export default HowItWorksSection;
