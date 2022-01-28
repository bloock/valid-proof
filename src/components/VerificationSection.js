import React, { useEffect, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Timeline } from "primereact/timeline";
import "../customstyles.css";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import FileSection from "./FileSection";

const VerificationSection = ({
  selectedFile,
  getProof,
  documentHash,
  date,
}) => {
  const [firstColor, setFirstColor] = useState("#dddddd");
  const [secondColor, setSecondColor] = useState("#dddddd");
  const [thirdColor, setThirdColor] = useState("#dddddd");
  const [fourthColor, setFourthColor] = useState("#dddddd");
  const [errorColor, setErrorColor] = useState("")
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  console.log(getProof);

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
    <div className="container-md mt-5 verification-section‹">
      <div className=" horizontal-center timeline-margins mb-5">
        <div className="bold-text header-title mb-4 mt-4">
          Your verification:
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
          <>
            <div className="pt-4">
              <span>
                <i className="pi pi-check" style={{ fontSize: " 1.5rem" }}></i>
              </span>
                <h3>Done!</h3>
              <div className="bold-text">
                <h4 className="mx-2">Your document has been verified</h4>
              </div>

              <div className="pt-2">
                <Card className="mt-4 px-4 py-2" style={{textAlign: "left"}}>
                  <div className="pb-5">
                    <span>
                      <i className="pi pi-file"></i>
                    </span>
                    <span className="mx-2 bold-text">{selectedFile.name}</span>
                  </div>
                  <div className="bold-text">Document hash</div>
                  <div className="" style={{ overflowWrap: "break-word" }}>
                    {documentHash && documentHash}
                  </div>
                  <Divider className="my-4" />
                  <div className="bold-text mt-4">Blockchain:</div>
                  <div>{getProof[0]["anchor"]["networks"][0]["name"]}</div>
                  <Divider className="my-4" />
                  <div className="bold-text">Tx hash</div>
                  <div className="" style={{ overflowWrap: "break-word" }}>
                    {getProof[0]["anchor"]["networks"][0]["tx_hash"]}
                  </div>
                  <div className="bold-text mt-4">Issue time</div>
                  <div>{date}</div>
                  <Divider className="my-4" />
                  <div className="bold-text">Issuer</div>
                  <div>BLOOCK</div>
                  <Divider className="my-4" />
                  <div className=""></div>
                </Card>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default VerificationSection;
