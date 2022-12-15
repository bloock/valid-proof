import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

type TooltipProps = {
  title: string;
  description: string;
  children: any;
};

const TooltipComponent: React.FC<TooltipProps> = ({
  title,
  description,
  children,
}) => {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">{title}</Popover.Header>
      <Popover.Body>{description}</Popover.Body>
    </Popover>
  );
  return (
    <OverlayTrigger overlay={popover} placement="top" trigger="hover">
      {children}
    </OverlayTrigger>
  );
};

export default TooltipComponent;
