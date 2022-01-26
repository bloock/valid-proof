import React from "react";
import { Divider } from "primereact/divider";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-light">
      <Divider className="my-0 py-2" />
      <div className="container-md py-5 header-text d-flex justify-content-between">
        <span>Powered by Ethereum</span>
        <span>
          Privacy policy
        </span>
      </div>
    </footer>
  );
};

export default Footer;
