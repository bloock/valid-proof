import { Button, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type FilePreviewProps = {
  payload: Uint8Array;
  name?: string;
  type: string;
};

const FilePreview: React.FC<FilePreviewProps> = ({ payload, name, type }) => {
  const { t } = useTranslation();
  const [numPages, setNumPage] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log("width", ref.current ? ref.current.clientWidth : 0);
  }, [ref.current]);

  function onDocumentLoadSuccess(pdfInfo: any) {
    setNumPage(pdfInfo.numPages);
  }

  const NoPreviewAvailable = () => {
    return (
      <div className="min-h-20 w-full h-full rounded-md">
        <Skeleton.Image className="!h-full !w-full" />
        <p className="-mt-8 text-center text-xs">
          {t("results.preview.not-available")}
        </p>
      </div>
    );
  };

  function previewBasedOnMimeType() {
    switch (type) {
      case "image/png":
      case "image/jpg":
      case "image/jpeg":
      case "image/svg+xml":
        return (
          <img
            width={ref.current?.offsetWidth}
            src={URL.createObjectURL(
              new Blob([payload], {
                type,
              })
            )}
          ></img>
        );
      case "application/pdf":
        return (
          <Document
            file={{ data: payload }}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} width={ref.current?.clientWidth} />
            <div className="flex flex-row items-center justify-center mt-2">
              <Button
                type="text"
                hidden={pageNumber > 1}
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                &lt;
              </Button>
              <div>
                <small>
                  {pageNumber} of {numPages}
                </small>
              </div>
              <Button
                type="text"
                hidden={numPages > pageNumber}
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                &gt;
              </Button>
            </div>
          </Document>
        );
      default:
        return <NoPreviewAvailable />;
    }
  }

  return (
    <div ref={ref} className="h-full w-full d-flex justify-content-center">
      {previewBasedOnMimeType() !== null ? (
        previewBasedOnMimeType()
      ) : (
        <>{t("not-found")}</>
      )}
    </div>
  );
};

export default FilePreview;
