import loadable from "@loadable/component";
import { Buffer } from "buffer";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import { FileElement } from "../../pages/Home";
import { getFileType } from "../../utils/use-file-type";
import { useIsJson } from "../../utils/use-is-json";
import { useIsUrl } from "../../utils/use-is-url";

const ReactJson = loadable(() => import("@uiw/react-json-view"));

type FilePreviewProps = {
  element: FileElement;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FilePreview: React.FC<FilePreviewProps> = ({ element }) => {
  const { t } = useTranslation("file-preview");

  const isJSONValid = useIsJson;
  const isURL = useIsUrl;

  const [elementMimeType, setElementMimeType] = useState<string | null>(null);
  const [srcElement, setSrcElement] = useState<any>(0);
  const [numPages, setNumPage] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess(pdfInfo: any) {
    setNumPage(pdfInfo.numPages);
  }

  useEffect(() => {
    async function fileType(value: any) {
      setElementMimeType(getFileType(value));
    }

    fileType(element.value);
  }, [element]);

  useEffect(() => {
    if (element) {
      if (isURL(element?.name)) {
        setSrcElement(element.name);
      } else if (isJSONValid(element.value)) {
        setSrcElement(element.value);
      } else if (element.value instanceof Uint8Array) {
        if (elementMimeType === "application/json") {
          setSrcElement(element.value);
        } else if (elementMimeType) {
          let btoaElement = Buffer.from(element.value).toString("base64");
          setSrcElement(`data:${elementMimeType};base64,${btoaElement}`);
        } else {
          setSrcElement(null);
        }
      } else {
        setSrcElement(null);
      }
    }
  }, [element, elementMimeType]);

  function previewBasedOnMimeType() {
    switch (elementMimeType) {
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
              value={srcElement}
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
                <div
                  className="w-25 d-flex flex-column align-items-end"
                  style={{ zIndex: "900" }}
                >
                  {pageNumber > 1 ? (
                    <button
                      className="mt-1 text-center preview-btn text-secondary"
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
                <div className="w-25" style={{ zIndex: "900" }}>
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
