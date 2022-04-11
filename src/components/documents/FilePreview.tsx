import loadable from "@loadable/component";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useFileType } from "../../utils/use-file-type";
import { useIsJson } from "../../utils/use-is-json";

const ReactJson = loadable(() => import("react-json-view"));

type FilePreviewProps = {
  element: any;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FilePreview: React.FC<FilePreviewProps> = ({ element }) => {
  const fileDetect = useFileType;
  const isJSONValid = useIsJson;
  let detectedFile = fileDetect(element);

  let srcElement: any;

  if (element) {
    if (element?.name instanceof URL) {
      srcElement = element.name.href;
    } else if (isJSONValid(element.value)) {
      srcElement = element.value;
    } else if (element.value instanceof Uint8Array) {
      if (detectedFile === "application/json") {
        srcElement = element.value;
      } else if (detectedFile) {
        let btoaElement = Buffer.from(element.value).toString("base64");
        srcElement = `data:${detectedFile};base64,${btoaElement}`;
      } else {
        srcElement = null;
      }
    } else {
      srcElement = null;
    }
  }
  function previewBasedOnMimeType() {
    switch (detectedFile) {
      case "image/png":
      case "image/jpg":
      case "image/jpg":
      case "image/jpeg":
      case "image/svg+xml":
        return <img className="img-contain" src={srcElement}></img>;
      case "application/x-msdownload":
      case "application/json":
        if (isJSONValid(JSON.stringify(element.value))) {
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
              src={srcElement}
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
  }

  return (
    <div className="p-card height-100 p-3 d-flex justify-content-center">
      {previewBasedOnMimeType() !== null ? (
        previewBasedOnMimeType()
      ) : (
        <>File not found</>
      )}
    </div>
  );
};

export default FilePreview;
