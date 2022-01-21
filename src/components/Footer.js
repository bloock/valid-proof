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
      <div className="container-lg py-5 header-text">
        <span>Powered by Ethereum</span>
        <span className="float-right">
          This website uses cookies to improve your experience and has and
          updated Privacy Policy
        </span>
      </div>
    </footer>
  );
};

export default Footer;
