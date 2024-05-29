import { Button, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import * as pdfJS from "pdfjs-dist";
import pdfJSWorkerURL from "pdfjs-dist/build/pdf.worker?url";

pdfJS.GlobalWorkerOptions.workerSrc = pdfJSWorkerURL;

type FilePreviewProps = {
  payload: Uint8Array;
  name?: string;
  type: string;
};

const FilePreview: React.FC<FilePreviewProps> = ({ payload, name, type }) => {
  const { t } = useTranslation();
  const [numPages, setNumPage] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (ref.current?.offsetWidth !== containerWidth) {
        setContainerWidth(ref.current?.offsetWidth || 0);
      }
    });

    resizeObserver.observe(ref.current);

    return function cleanup() {
      resizeObserver.disconnect();
    };
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
            width={containerWidth}
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
                style={{
                  visibility: pageNumber > 1 ? "visible" : "hidden",
                }}
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                &lt;
              </Button>
              <small className="px-2">
                {pageNumber} of {numPages}
              </small>
              <Button
                type="text"
                style={{
                  visibility: numPages > pageNumber ? "visible" : "hidden",
                }}
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
