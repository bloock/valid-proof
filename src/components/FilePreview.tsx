import React from "react";
import { elementType } from "./ElementType";

type FilePreviewProps = {
  element: any;
};

const FilePreview: React.FC<FilePreviewProps> = ({ element }) => {
  debugger;
  let filePreviewElement = elementType(element);
  return <>{filePreviewElement}</>;
};

export default FilePreview;
