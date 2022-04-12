import { Proof } from "@bloock/sdk";
import { Timeline } from "primereact/timeline";
import React from "react";

type StepperVerificationProps = {
  errorStep?: number | null;
  recordTimestamp?: number | null;
  recordProof?: Proof | null;
  recordProofVerified?: boolean | null;
};

const StepperVerification: React.FC<StepperVerificationProps> = ({
  errorStep,
  recordTimestamp,
  recordProof,
  recordProofVerified,
}) => {
  const colors = {
    success: "#06d7be",
    error: "#F55845",
    idle: "#d7d7d7",
  };

  const events = [
    {
      status: "Retrieve integrity proof",
      icon:
        errorStep === 0
          ? "pi pi-times px-2 py-2 click-icon"
          : recordProof == null
          ? "pi pi-check px-2 py-2 click-icon pi pi-spin pi-spinner"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 0
          ? colors.error
          : recordProof == null
          ? colors.idle
          : colors.success,
    },
    {
      status: "Validate integrity proof",
      icon:
        errorStep === 1
          ? "pi pi-times px-2 py-2 click-icon"
          : recordProofVerified === null && errorStep !== 0
          ? "pi pi-check px-2 py-2 click-icon pi pi-spin pi-spinner"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 1
          ? colors.error
          : recordProofVerified === null
          ? colors.idle
          : colors.success,
    },
    {
      status: "Validate existence in blockchain",
      icon:
        errorStep === 2
          ? "pi pi-times px-2 py-2 click-icon"
          : recordTimestamp === null && errorStep !== 0 && errorStep !== 1
          ? "pi pi-check px-2 py-2 click-icon pi pi-spin pi-spinner"
          : "pi pi-check px-2 py-2 click-icon",
      color:
        errorStep === 2
          ? colors.error
          : recordTimestamp === null
          ? colors.idle
          : colors.success,
    },
  ];

  const customizedMarker = (item: any) => {
    return (
      <span
        className="custom-marker p-shadow-2 circle"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    );
  };

  const customizedContent = (item: any) => {
    if (item.status === events[events.length - 1].status) {
      return (
        <>
          <div>{item.status}</div>
          <div className="px-4">
            <span>{item.description}</span>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>{item.status}</div>
          <div className="px-4">
            <span>{item.description}</span>
          </div>
        </>
      );
    }
  };

  return (
    <Timeline
      value={events}
      content={customizedContent}
      marker={customizedMarker}
      className="steper"
    />
  );
};

export default StepperVerification;
