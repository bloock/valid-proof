import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import { Divider } from "primereact/divider";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-light">
      <Divider className="my-0 py-2" />
      <div className="container-md px-4 py-5 header-text d-flex justify-content-between">
        <span>Powered by BLOOCK</span>
      </div>
    </footer>
  );
};

export default Footer;
