import loadable from "@loadable/component";
import React from "react";
// import ReactJson from "react-json-view";
import { Document, Page, pdfjs } from "react-pdf";
import { useFileType } from "../utils/use-file-type";
import { useIsJson } from "../utils/use-is-json";

const ReactJson = loadable(() => import("react-json-view"));

type FilePreviewProps = {
  element: any;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FilePreview: React.FC<FilePreviewProps> = ({ element }) => {
  const fileDetect = useFileType;
  const isJSONValid = useIsJson;
  let detectedFile = fileDetect(element);

  const srcElement =
    element.name instanceof URL ? element.name.href : element.value;

  const previewBasedOnMimeType = () => {
    switch (detectedFile) {
      case "image/png":
        return <img className="img-contain" src={srcElement}></img>;
      case "image/jpg":
        return <img className="img-contain" src={srcElement}></img>;
      case "image/jpg":
        return <img className="img-contain" src={srcElement}></img>;
      case "image/jpeg":
        return <img className="img-contain" src={srcElement}></img>;
      case "image/svg+xml":
        return <img className="img-contain" src={srcElement}></img>;
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
        return (
          <div className="pdf-viewer">
            <Document file={srcElement} className="pdf-viewer">
              <Page pageNumber={1} />
            </Document>
          </div>
        );
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
