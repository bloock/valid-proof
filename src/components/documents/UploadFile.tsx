import { Record } from "@bloock/sdk";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { FileElement } from "../../pages/Home";
import "../../styles.css";
import { useFileType } from "../../utils/use-file-type";
import Button from "../elements/Button";

type FileSectionProps = {
  onElementChange: (element: any) => any;
  element: FileElement | null;
};

const primaryColor = (window as any).env.PRIMARY_COLOR
  ? (window as any).env.PRIMARY_COLOR
  : "#07D1B6";
const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 3,
  borderRadius: 2,
  borderColor: "blue",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .24s ease-in-out",
  height: "323px",
  outline: `2px dashed ${primaryColor}`,
  outlineOffset: "-24px",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const FileSection: React.FC<FileSectionProps> = ({
  onElementChange,
  element: elementType,
}) => {
  const { t } = useTranslation("upload-file");

  const [element, setElement] = useState<FileElement | null>(elementType);

  const fileTypeDetect = useFileType;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length >= 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, []);

  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({ onDrop });

  useEffect(() => {
    onElementChange(element);
  }, [element]);

  function fileToBytes(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        let arraybuffer = reader.result;
        if (arraybuffer) {
          let bytes = new Uint8Array(arraybuffer as ArrayBuffer);
          resolve(bytes);
        } else {
          reject();
        }
      };
      reader.onerror = function () {
        reject();
      };
      reader.readAsArrayBuffer(file);
    });
  }

  function fileToJSON(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        try {
          resolve(JSON.parse(reader.result as string));
        } catch {
          reject();
        }
      };
      reader.onerror = function () {
        reject();
      };
      reader.readAsText(file);
    });
  }

  const handleFileChange = async (file: File | null) => {
    if (file != null) {
      let fileType = fileTypeDetect(file.type);
      switch (fileType) {
        case "application/pdf":
          setElement({
            name: file?.name,
            value: await fileToBytes(file),
            record: await Record.fromPDF(await fileToBytes(file)),
          });
          break;
        case "application/json":
          setElement({
            name: file?.name,
            value: await fileToJSON(file),
            record: await Record.fromJSON(await fileToJSON(file)),
          });

          break;
        default:
          setElement({
            name: file?.name,
            value: await fileToBytes(file),
            record: Record.fromTypedArray(await fileToBytes(file)),
          });

          break;
      }
    } else {
      setElement(null);
    }
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <section>
      <div
        className="container mt-5"
        {...getRootProps({ style: style as any })}
      >
        <div className="vertical-center horizontal-center">
          <div>
            {element ? (
              <div>
                <div>
                  <span>
                    {element && element !== undefined ? element.name : null}
                  </span>
                  <span onClick={() => handleFileChange(null)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="bi bi-x"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <p>{t("drag&drop")}</p>
                <p>{t("or")}</p>

                <Button className="button">
                  <input {...getInputProps()} />
                  {t("select")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileSection;
