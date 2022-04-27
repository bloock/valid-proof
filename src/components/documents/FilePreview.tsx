import loadable from "@loadable/component";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import { useFileType } from "../../utils/use-file-type";
import { useIsJson } from "../../utils/use-is-json";
import { useIsUrl } from "../../utils/use-is-url";

const ReactJson = loadable(() => import("react-json-view"));

type FilePreviewProps = {
  element: any;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FilePreview: React.FC<FilePreviewProps> = ({ element }) => {
  const { t } = useTranslation("file-preview");

  const fileDetect = useFileType;
  const isJSONValid = useIsJson;
  const isURL = useIsUrl;
  let detectedFile = fileDetect(element);
  const [numPages, setNumPage] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess(pdfInfo: any) {
    setNumPage(pdfInfo.numPages);
  }

  let srcElement: any;

  if (element) {
    if (isURL(element?.name)) {
      srcElement = element.name;
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
            <Document
              file={srcElement}
              className="pdf-viewer"
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
              <div className="d-flex align-items-center justify-content-center text-secondary mt-2">
                <div className="w-25 d-flex flex-column align-items-end">
                  {pageNumber > 1 ? (
                    <button
                      className="mt-1 text-center preview-btn text-secondary "
                      onClick={() => setPageNumber(pageNumber - 1)}
                    >
                      <small className="cursor-pointer">&lt;</small>
                    </button>
                  ) : null}
                </div>
                <div>
                  <small>
                    {pageNumber} of {numPages}
                  </small>
                </div>
                <div className="w-25">
                  {numPages > pageNumber ? (
                    <button
                      className="mt-1 text-center preview-btn text-secondary"
                      onClick={() => setPageNumber(pageNumber + 1)}
                    >
                      <small className="cursor-pointer">&gt;</small>
                    </button>
                  ) : null}
                </div>
              </div>
            </Document>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div
      className="p-card p-3 d-flex justify-content-center"
      style={{ maxHeight: "550px" }}
    >
      {previewBasedOnMimeType() !== null ? (
        previewBasedOnMimeType()
      ) : (
        <>{t("not-found")}</>
      )}
    </div>
  );
};

export default FilePreview;
