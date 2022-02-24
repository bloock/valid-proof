import React, { Fragment } from "react";
import { Divider } from "primereact/divider";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../customstyles.css";
import logo from "../images/validProof_logo.jpg";

const Header = () => {
  return (
    <Fragment >
    <div className="fixed-top bg-white">
      <div className="container-md px-4 py-2 pt-4 d-flex align-items-center justify-content-between">
        <img alt="Card" src={logo} />

        {/* <span className="float-right">
          <span className="header-text mx-5">Blockchain</span>
          <span className="header-text ">Resources</span>
        </span> */}
      </div>
      <Divider className="mb-0"/>
      </div>
    </Fragment>
  );
};

export default Header;
