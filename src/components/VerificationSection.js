import React from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Timeline } from "primereact/timeline";
import "../customstyles.css";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

const VerificationSection = () => {
  const events = [
    {
      status: "Validate hash",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: "#555555",
    },
    {
      status: "Validate integrity proof",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: "#555555",
    },
    {
      status: "Validate blockchain registrations ",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: "#555555",
    },
    {
      status: "Validate issuer",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: "#555555",
    },
  ];

  const customizedMarker = (item) => {
    return (
      <span
        className="custom-marker p-shadow-2 circle"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    );
  };

  const customizedContent = (item) => {
    if (item.status === "Validate issuer") {
      return (
        <div className="horizontal-center half-right double-width">
          <div className="bold-text">{item.status}</div>
          <div className="px-4">
            <span>{item.description}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="horizontal-center half-right">
          <div className="bold-text">{item.status}</div>
          <div className="px-4">
            <span>{item.description}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container-lg">
      <div className="horizontal-center mx-5 px-5">
        <div className="bold-text header-title mb-4 mt-4">
          Your verification
        </div>
        <Timeline
          value={events}
          layout="horizontal"
          content={customizedContent}
          marker={customizedMarker}
          className="px-5"
        />
      </div>
      <div className="little-top-margin"></div>
      <div className="horizontal-center">
        <div className="success-color">
          <span>
            <i className="circle check-success pi pi-check px-1 py-1 click-icon icon-small"></i>
          </span>
          <span className="mx-2">Your document has been verified</span>
        </div>
      </div>
      {/*   <div className="horizontal-center">
                <div className='failure-color'>
                    <span>
                        <i className='circle check-failure pi pi-check px-1 py-1 click-icon icon-small'></i>
                    </span>
                    <span className="mx-2">Your document can't be verified</span>
                </div>
            </div> */}
      <div className="mt-5">
        <Card className=" px-4 py-2" style={{ width: "46rem", margin:"0 auto"}}>
          <div className="pb-5">
            <span>
              <i className="pi pi-file"></i>
            </span>
            <span className="mx-2 bold-text">Test.pdf</span>
          </div>
          <div className="bold-text">Document hash</div>
          <div>
            0x29d9eabaf4387459664aa23bbf1a81c20c8e71517642508445d70f9ec768ca3a
          </div>
          <Divider className="my-4" />
          <div className="bold-text mt-4">Blockchain:</div>
          <div>Ethereum Mainnet</div>
          <Divider className="my-4" />
          <div className="bold-text">Block number</div>
          <div>0x5EE4Ec3Cbee909050E68c7FF7a8b422cfbd72244</div>
          <Divider className="my-4" />
          <div className="bold-text mt-4">Issute time</div>
          <div>June 19, 2021, 09:29:59 AM</div>
          <Divider className="my-4" />
          <div className="bold-text">Issuer</div>
          <div>BLOOCK</div>
          <Divider className="my-4" />
          <div className="">
            <span className="mx-2 bold-text">Technical details</span>
            <span>
              <i className="pi pi-chevron-down"></i>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerificationSection;
