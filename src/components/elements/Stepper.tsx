import { Timeline } from "primereact/timeline";
import React from "react";

type Events = {
  status?: string | null;
  icon?: string | null;
  color?: string | null;
};

type StepperVerificationProps = {
  events: Events[];
};

const StepperVerification: React.FC<StepperVerificationProps> = ({
  events,
}) => {
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
          <span
            className="text-uppercase text-secondary"
            style={{ fontSize: "11px" }}
          >
            {item.description}
          </span>
          <div>{item.status}</div>
          <div className="px-4"></div>
        </>
      );
    } else {
      return (
        <>
          <span
            className="text-uppercase text-secondary"
            style={{ fontSize: "11px" }}
          >
            {item.description}
          </span>
          <div>{item.status}</div>
          <div className="px-4"></div>
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
