import React from "react";
import ReactJson from "react-json-view";
import { useFileType } from "../utils/use-file-type";

type FilePreviewProps = {
  element: any;
};

const FilePreview: React.FC<FilePreviewProps> = ({ element }) => {
  const fileDetect = useFileType;
  let detectedFile = fileDetect(element);

  console.log(detectedFile);

  const previewBasedOnMimeType = () => {
    switch (detectedFile) {
      case "image/png":
        return <img className="img-contain" src={element.value}></img>;
      case "image/jpg":
        debugger;
        return <img className="img-contain" src={element.value}></img>;
      case "image/svg+xml":
        debugger;
        return <img className="img-contain" src={element.value}></img>;
      case "application/json":
        if (process.env.JSON_FILE_PREVIEW === undefined) {
          return <ReactJson src={JSON.parse(element)} />;
        } else {
          return null;
        }
      case "application/pdf":
        return element.name;
      default:
        return null;
    }
  };

  return (
    <div className="p-card height-100 p-4 d-flex justify-content-center">
      {previewBasedOnMimeType() !== null ? (
        previewBasedOnMimeType()
      ) : (
        <>Not found</>
      )}
    </div>
  );
};

export default FilePreview;
