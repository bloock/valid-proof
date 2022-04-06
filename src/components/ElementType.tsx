import React from "react";
import ReactJson from "react-json-view";
import { useFileType } from "../utils/use-file-type";

function elementType(element: any) {
  const fileDetect = useFileType;
  let detectedFile = fileDetect(element);
  switch (detectedFile) {
    case "image/png":
      return <img src={element.value}></img>;
    case "application/json":
      return <ReactJson src={JSON.parse(element)} />;
    case "application/pdf":
      return element.name;
    default:
      return null;
  }
}

export { elementType };
