import React, { useEffect, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Timeline } from "primereact/timeline";
import "../customstyles.css";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

const VerificationSection = (props) => {
  const [firstColor, setFirstColor] = useState("#dddddd");
  const [secondColor, setSecondColor] = useState("#dddddd");
  const [thirdColor, setThirdColor] = useState("#dddddd");
  const [fourthColor, setFourthColor] = useState("#dddddd");
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setFirstColor("#06d7be");
    }, 1500);
  });
  useEffect(() => {
    setInterval(() => {
      setSecondColor("#06d7be");
    }, 3000);
  });
  useEffect(() => {
    setInterval(() => {
      setThirdColor("#06d7be");
    }, 4500);
  });
  useEffect(() => {
    setInterval(() => {
      setFourthColor("#06d7be");
    }, 6000);
  });
  useEffect(() => {
    setInterval(() => {
      setSuccessMessage(true);
    }, 7000);
  });
  const events = [
    {
      status: "Validate hash",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: firstColor,
    },
    {
      status: "Validate integrity proof",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: secondColor,
    },
    {
      status: "Validate blockchain registrations ",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: thirdColor,
    },
    {
      status: "Validate issuer",
      description: "",
      icon: "pi pi-check px-2 py-2 click-icon",
      color: fourthColor,
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
          <div>{item.status}</div>
          <div className="px-4">
            <span>{item.description}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="horizontal-center half-right">
          <div>{item.status}</div>
          <div className="px-4">
            <span>{item.description}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container-lg">
      <div className="horizontal-center timeline-margins">
        <div className="bold-text header-title mb-4 mt-4">
          Please wait while your file is being validated.
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
        {successMessage === true ? (
          <div className="pt-4">
            <span>
              <i className="pi pi-check" style={{ fontSize: " 2rem" }}></i>
            </span>
            <div className="bold-text">
              <h3>Done!</h3>
              <h4 className="mx-2">Your document has been verified</h4>
            </div>

           {/*  place here the details of the proof response */}

          </div>
        ) : (
          ""
        )}
      </div>
      {/*   <div className="horizontal-center">
                <div className='failure-color'>
                    <span>
                        <i className='circle check-failure pi pi-check px-1 py-1 click-icon icon-small'></i>
                    </span>
                    <span className="mx-2">Your document can't be verified</span>
                </div>
            </div> */}
      {/* <div className="mt-5">
        <Card className=" px-4 py-2" style={{ }}>
          <div className="pb-5">
            <span>
              <i className="pi pi-file"></i>
            </span>
            <span className="mx-2 bold-text">Test.pdf</span>
          </div>
          <div className="bold-text">Document hash</div>
          <div className="" style={{ overflowWrap: "break-word"}}>
            0x29d9eabaf4387459664aa23bbf1a81c20c8e71517642508445d70f9ec768ca3a
          </div>
          <Divider className="my-4" />
          <div className="bold-text mt-4">Blockchain:</div>
          <div>Ethereum Mainnet</div>
          <Divider className="my-4" />
          <div className="bold-text">Block number</div>
          <div>0x5EE4Ec3Cbee909050E68c7FF7a8b422cfbd72244</div>
          <Divider className="my-4" />
          <div className="bold-text mt-4">Issue time</div>
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
      </div> */}
    </div>
  );
};

export default VerificationSection;
