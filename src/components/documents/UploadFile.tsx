import { AesDecrypter, RecordClient, RsaDecrypter } from "@bloock/sdk";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FileElement } from "../../pages/Home";
import "../../styles.css";
import { getFileType } from "../../utils/use-file-type";
import { useIsJson } from "../../utils/use-is-json";
import Button from "../elements/Button";
import Popup from "../elements/Modal";

type FileSectionProps = {
  onElementChange: (element: any) => any;
  element: FileElement | null;
  errorFetchDocument: boolean;
  onErrorFetchDocument: (error: any) => any;
  isDocumentEncrypted: boolean;
};

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
  color: "#a6a6a6",
  transition: "border .24s ease-in-out",
  height: "323px",
  outline: "2px dashed var(--primary-bg-color)",
  outlineOffset: "-24px",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "red",
};

const FileSection: React.FC<FileSectionProps> = ({
  onElementChange,
  element: elementType,
  errorFetchDocument,
  onErrorFetchDocument,
}) => {
  const { t } = useTranslation("upload-file");

  let recordClient = new RecordClient();

  const [element, setElement] = useState<FileElement | null>(elementType);
  const [documentTypeError, setDocumentTypeError] = useState<string>("");
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
  const [show, setShow] = useState(false);

  const [encryptionAlg, setEncryptionAlg] = useState<string | null>(null);
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [encryptionPassword, setEncryptionPassword] = useState<string>("");
  const [decodedFile, setDecodedFile] = useState<string | null>(null);

  const [uiError, setUiError] = useState<string>("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onPasswordChange = (e: any) => {
    setEncryptionPassword(e.target.value);
    setUiError("");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length >= 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const navigate = useNavigate();

  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({ onDrop, multiple: false });

  useEffect(() => {
    onElementChange(element);
  }, [element?.record]);

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
    setDocumentTypeError("");
    setIsFileUploaded(true);
    const isJSONValid = useIsJson;

    if (file != null) {
      let bytes = await file.arrayBuffer();
      let decodedFile = new TextDecoder().decode(bytes);
      setDecodedFile(decodedFile);
      if (isJSONValid(decodedFile)) {
        let value = JSON.parse(decodedFile);
        if (value["_metadata_"] && value["_metadata_"].is_encrypted) {
          setEncryptionAlg(value["_metadata_"].encryption_alg);
          setIsEncrypted(true);
          handleShow();
          setElement({
            name: file.name,
            value: value,
            record: undefined,
          });
        } else {
          setElement({
            name: file.name,
            value: value,
            record: await recordClient
              .fromJson(JSON.parse(decodedFile))
              .build(),
          });
        }
      } else {
        let fileType = await getFileType(new Uint8Array(bytes));
        try {
          switch (fileType) {
            case "application/pdf":
              setElement({
                name: file?.name,
                value: await fileToBytes(file),
                record: await recordClient
                  .fromFile(await fileToBytes(file))
                  .build(),
              });
              break;
            case "application/json":
              setElement({
                name: file?.name,
                value: await fileToJSON(file),
                record: await recordClient
                  .fromJson(await fileToJSON(file))
                  .build(),
              });

              break;
            default:
              setElement({
                name: file?.name,
                value: await fileToBytes(file),
                record: await recordClient
                  .fromFile(await fileToBytes(file))
                  .build(),
              });

              break;
          }
        } catch (e) {
          console.log(e);
          setDocumentTypeError(t("file-not-accepted"));
          setIsFileUploaded(false);
        }
      }
    } else {
      onErrorFetchDocument(null);
      setElement(null);
      setIsFileUploaded(false);
      goToTop();
      navigate("/");
      setIsEncrypted(false);
    }
  };

  const decryptRecord = async () => {
    if (isEncrypted && decodedFile && encryptionAlg && encryptionPassword) {
      try {
        let decryptedRecord = await recordClient
          .fromString(decodedFile)
          .withDecrypter(
            encryptionAlg === "A256GCM"
              ? new AesDecrypter(encryptionPassword)
              : new RsaDecrypter(encryptionPassword)
          )
          .build();
        handleClose();
        setIsEncrypted(false);
        setElement({
          name: element?.name,
          value: element?.value,
          record: decryptedRecord,
        });
      } catch (e) {
        console.log(e);
        setUiError(t("ui-password-error"));
        return;
      }
      setDecodedFile(null);
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
      {element || errorFetchDocument ? (
        <div className="container mt-3 w-full p-0" style={{ height: "250px" }}>
          <div className="d-flex align-items-center justify-content-center h-100 bg-light p-0">
            <div>
              <div>
                {element || errorFetchDocument ? (
                  <Button className="button" cta={() => handleFileChange(null)}>
                    {t("verify-another")}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {isFileUploaded ? (
            <div
              className="container mt-3"
              {...getRootProps({ style: style as any })}
            >
              <div className="vertical-center horizontal-center">
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "2rem" }}
                ></i>
              </div>
            </div>
          ) : (
            <div
              className="container mt-3"
              {...getRootProps({ style: style as any })}
            >
              <div className="vertical-center horizontal-center">
                <div>
                  <div id="select-file">
                    <p>{t("drag&drop")}</p>
                    <p>{t("or")}</p>

                    <Button
                      className="button mt-1"
                      disabled={element ? true : false}
                    >
                      <input {...getInputProps()} />

                      {t("select")}
                    </Button>
                  </div>
                  <p className="mt-2" style={{ fontSize: "10px" }}>
                    {t("file-types")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {documentTypeError !== "" ? (
        <>
          <div className="p-2 px-3 mt-3 alert alert-warning">
            {documentTypeError}
          </div>
        </>
      ) : null}

      <Popup
        title={t("decrypt-modal-title")}
        body={t("decrypt-modal-body")}
        firstInput={t("password")}
        firstInputType="password"
        onChange={onPasswordChange}
        onClick={decryptRecord}
        uiError={uiError}
        onHide={handleClose}
        onShow={show}
      ></Popup>
    </section>
  );
};

export default FileSection;
