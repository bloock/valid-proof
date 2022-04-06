import React from "react";
import ReactJson from "react-json-view";
import { useFileType } from "../utils/use-file-type";
import { useIsJson } from "../utils/use-is-json";

type FilePreviewProps = {
  element: any;
};

const FilePreview: React.FC<FilePreviewProps> = ({ element }) => {
  const fileDetect = useFileType;
  const isJSONValid = useIsJson;
  let detectedFile = fileDetect(element);

  const previewBasedOnMimeType = () => {
    switch (detectedFile) {
      case "image/png":
        return <img className="img-contain" src={element.value}></img>;
      case "image/jpg":
        return <img className="img-contain" src={element.value}></img>;
      case "image/jpeg":
        return <img className="img-contain" src={element.value}></img>;
      case "image/svg+xml":
        return <img className="img-contain" src={element.value}></img>;
      case "application/json":
        if (isJSONValid(element)) {
          return (
            <ReactJson
              style={{
                maxWidth: "100%",
                maxHeight: "700px",
                overflow: "scroll",
              }}
              displayDataTypes={false}
              displayObjectSize={false}
              name={false}
              src={JSON.parse(element)}
            />
          );
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
    <div className="p-card height-100 p-3 d-flex justify-content-center">
      {previewBasedOnMimeType() !== null ? (
        previewBasedOnMimeType()
      ) : (
        <>Not found</>
      )}
    </div>
  );
};

export default FilePreview;
