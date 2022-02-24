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
      <div className="container-md px-4 pt-10 ">
        <h2 className="bold-text title mb-5 text-center pt-6">How it works</h2>
        <Row className="pt-2">
          <Col
            className="text-center text-lg-start text-break"
            style={{ width: "45%" }}
          >
            <h4 className="bold-text">Select the type of record to provide</h4>
            <div className="mb-4">
              Select if your data is in document format or in JSON format.
            </div>
            <img
              alt="Card"
              src={demoimage1}
              style={{ width: "400px" }}
              className="shadow-sm p-3 mb-5 bg-body rounded"
            />
          </Col>
          <Col className="text-center text-lg-start text-break">
            <h4 className="bold-text">Load your record</h4>
            <div className="mb-4">
              Select from your system or write down the record you want to
              validate.
            </div>
            <img
              alt="Card"
              src={demoimage2}
              style={{ width: "400px" }}
              className="shadow-sm p-3 mb-5 bg-body rounded"
            />
          </Col>
          <Col className="text-center text-lg-start text-break">
            <h4 className="bold-text">Get your results</h4>
            <div className="mb-4">
              Obtain a summarised mathematical evidence proving the authenticity
              and integrity of your record.
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
