import React, { Fragment } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSection from "./FileSection";
import HowItWorksSection from "./HowItWorksSection";
import "../customstyles.css";

const Body = () => {
  return (
    <Fragment>
      <div className="top-margin"></div>
      <FileSection />
      <div className="top-margin"></div>
      <HowItWorksSection />
    </Fragment>
  );
};

export default Body;
