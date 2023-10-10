import {
  AesDecrypter,
  AuthenticityClient,
  Bloock,
  Record,
  RecordClient,
  RsaDecrypter,
} from "@bloock/sdk";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Buffer } from "buffer";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import FileSection from "../components/documents/UploadFile";
import Popup from "../components/elements/Modal";
import VerificationSection from "../components/verification/VerificationMain";
import demoimage3 from "../images/get_results.jpg";
import demoimage2 from "../images/verify_documents.jpg";
import "../styles.css";
import { getCookie } from "../utils/cookie";
import { Truncate } from "../utils/truncate";
import { getFileType } from "../utils/use-file-type";
import { useIsJson } from "../utils/use-is-json";
import { useIsUrl } from "../utils/use-is-url";

export type FileElement = {
  name?: string;
  value?: any;
  record?: Record;
};

const Home = () => {
  const { t } = useTranslation("home");
  const { t: tr } = useTranslation("upload-file");

  if ((window as any).env.API_HOST) {
    Bloock.setApiHost((window as any).env.API_HOST);
  }
  Bloock.setApiKey((window as any).env.API_KEY);

  const recordClient = new RecordClient();
  const authenticityClient = new AuthenticityClient();

  const session = getCookie("hasValidated");

  const [element, setElement] = useState<FileElement | null>(null);
  const verificationRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const [errorFetchDocument, setErrorFetchDocument] = useState<boolean>(false);
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [encryptionAlg, setEncryptionAlg] = useState<string | null>(null);
  const [uiError, setUiError] = useState<string>("");
  const [encryptionPassword, setEncryptionPassword] = useState<string>("");
  const [encryptedBytesDoc, setEncryptedBytesDoc] = useState<Uint8Array | null>(
    null
  );
  const [validateFromUrl, setValidateFromUrl] = useState<boolean>(false);

  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [recordCommonName, setRecordCommonName] = useState<string | null>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onPasswordChange = (e: any) => {
    setEncryptionPassword(e.target.value);
    setUiError("");
  };

  useEffect(() => {
    setUiError("");
  }, [encryptedBytesDoc]);

  async function fileLoader(urlParam: any) {
    const isJSONValid = useIsJson;

    urlParam = new URL(urlParam);
    let error;

    let bytes = await axios
      .get(urlParam, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        return Buffer.from(res.data);
      })
      .catch((e) => {
        error = e;
        setErrorFetchDocument(true);

        return Buffer.from([]);
      });

    setEncryptedBytesDoc(bytes);

    let urlDecodedContent = new TextDecoder().decode(bytes);
    if (error === undefined) {
      if (isJSONValid(urlDecodedContent)) {
        let value = JSON.parse(urlDecodedContent);
        if (value["_metadata_"].is_encrypted) {
          setEncryptionAlg(value["_metadata_"].encryption_alg);
          setIsEncrypted(true);
          handleShow();
          setElement({
            name: urlParam.href,
            value: value,
            record: undefined,
          });
        } else {
          setElement({
            name: urlParam.href,
            value: value,
            record: await recordClient
              .fromJson(JSON.parse(urlDecodedContent))
              .build(),
          });
        }
      } else if (await getFileType(bytes)) {
        setElement({
          name: urlParam.href,
          value: bytes,
          record: await recordClient.fromFile(bytes).build(),
        });
      } else {
        setErrorFetchDocument(true);
        setElement(null);
      }
    } else {
      setErrorFetchDocument(true);
      setValidateFromUrl(false);
    }
  }

  useEffect(() => {
    const recordQuery = searchParams.get("record");
    const isURL = useIsUrl;

    if (isURL(recordQuery)) {
      fileLoader(recordQuery);
      setValidateFromUrl(true);
    } else {
      setValidateFromUrl(false);
    }
  }, [searchParams]);

  async function decodedDataLoader() {
    if (decodedData) {
      setElement({
        name: Truncate(decodedData as string, 30, "..."),
        value: decodedData,
        record: await recordClient.fromString(decodedData).build(),
      });
    } else {
      setElement(null);
    }
  }

  const decryptRecord = async () => {
    if (
      isEncrypted &&
      encryptedBytesDoc &&
      encryptionAlg &&
      encryptionPassword
    ) {
      try {
        if (encryptionAlg === "A256GCM") {
          let decryptedRecord = await recordClient
            .fromBytes(encryptedBytesDoc)
            .withDecrypter(new AesDecrypter(encryptionPassword))
            .build();
          handleClose();
          setIsEncrypted(false);
          setElement({
            name: element?.name,
            value: decryptedRecord.retrieve(),
            record: decryptedRecord,
          });
        } else {
          let decryptedRecord = await recordClient
            .fromBytes(encryptedBytesDoc)
            .withDecrypter(new RsaDecrypter(encryptionPassword))
            .build();
          handleClose();
          setIsEncrypted(false);
          setElement({
            name: element?.name,
            value: decryptedRecord.retrieve(),
            record: decryptedRecord,
          });
        }
      } catch (e) {
        console.log(e);
        setUiError(tr("ui-password-error"));
        return;
      }
      setEncryptedBytesDoc(null);
    }
  };

  useEffect(() => {
    const base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const dataQuery = searchParams.get("data");

    if (base64regex) {
      if (base64regex.test(dataQuery as any)) {
        setDecodedData(window.atob(dataQuery as any));
      } else {
        setErrorFetchDocument(true);
      }
    }

    if (decodedData && dataQuery) {
      decodedDataLoader();
    }
  }, [searchParams, decodedData]);

  useEffect(() => {
    const getRecordSignature = async () => {
      try {
        if (element?.record) {
          let signatures = await authenticityClient.getSignatures(
            element?.record
          );

          console.log(signatures);
          if (signatures?.length > 0) {
            setIsSigned(true);
          }

          let retrievedName = await authenticityClient.getSignatureCommonName(
            signatures[0]
          );
          console.log(retrievedName);
          if (retrievedName) {
            setRecordCommonName(retrievedName);
          } else {
            setRecordCommonName(null);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    getRecordSignature();
  }, []);

  useEffect(() => {
    const id: string | null = "scoll-offset";
    if (
      (element && verificationRef && verificationRef.current) ||
      errorFetchDocument
    ) {
      if (document.getElementById(id)) {
        const yOffset: number = -80;
        const div: HTMLElement | null = document.getElementById(id);
        const y =
          (div as HTMLElement)?.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [verificationRef, element, errorFetchDocument]);

  return (
    <Fragment>
      <div>
        <div className="top-margin"></div>
        <div className="container-md pt-6 px-4">
          <Row className="flex-column flex-lg-row align-items-center">
            <Col style={{ paddingRight: "10px", paddingTop: "10px" }}>
              <h1>{t("title")}</h1>
              <h3 className="mt-3">{t("subtitle")}</h3>
              <ul className="mt-4 features">
                <li className="mt-2">
                  <i
                    className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                    style={{
                      marginRight: "10px",
                      backgroundColor: "var(--primary-bg-color)",
                    }}
                  ></i>
                  <p>{t("feature-one")}</p>
                </li>
                <li className="mt-3">
                  <i
                    className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                    style={{
                      marginRight: "10px",
                      backgroundColor: "var(--primary-bg-color)",
                    }}
                  ></i>

                  <p>{t("feature-two")}</p>
                </li>
                <li className=" mt-3">
                  <i
                    className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                    style={{
                      marginRight: "10px",
                      backgroundColor: "var(--primary-bg-color)",
                    }}
                  ></i>

                  <p>{t("feature-three")}</p>
                </li>
              </ul>
            </Col>

            {!element && !errorFetchDocument ? (
              <Col>
                <FileSection
                  onElementChange={(element) => setElement(element)}
                  errorFetchDocument={errorFetchDocument}
                  onErrorFetchDocument={(error) => setErrorFetchDocument(error)}
                  element={null}
                  isDocumentEncrypted={isEncrypted}
                  commonName={recordCommonName}
                ></FileSection>
              </Col>
            ) : null}
          </Row>

          {element || errorFetchDocument ? (
            <div ref={verificationRef} id="scoll-offset">
              <VerificationSection
                element={element}
                errorFetchDocument={errorFetchDocument}
                onErrorFetchDocument={(error) => setErrorFetchDocument(error)}
                encryptionAlg={encryptionAlg ? encryptionAlg : null}
                commonName={recordCommonName}
              />
              <FileSection
                onElementChange={(element) => setElement(element)}
                onErrorFetchDocument={(error) => setErrorFetchDocument(error)}
                errorFetchDocument={errorFetchDocument}
                element={element}
                isDocumentEncrypted={isEncrypted}
                commonName={recordCommonName}
              ></FileSection>
            </div>
          ) : null}
        </div>
        <div className="top-margin"></div>
        {!!session === false ? (
          <div className="bg-light pt-3 pb-5 mt-3">
            <div className="container-md px-4 pt-10">
              <h2 className="mb-4 text-center pt-5">{t("test-section")}</h2>
              <Row className="pt-2">
                <Col className="text-center text-lg-start text-break d-flex flex-column align-items-center">
                  <div
                    className="shadow-sm p-3 mb-4 d-flex justify-content-center bg-body rounded align-items-center  "
                    style={{
                      width: "400px",
                      height: "240px",
                      minWidth: "200px",
                      maxWidth: "100%",
                    }}
                  >
                    <div className="d-flex w-100">
                      <a
                        className="px-3 align-items-center d-flex flex-column"
                        style={{ width: "49%" }}
                        href={`${process.env.PUBLIC_URL}/pdf/valid_certificate_file.pdf`}
                        download
                      >
                        <img
                          src="../../icons/download_file.svg"
                          alt="Download"
                          width={"50px"}
                          className="downloadBtn"
                        />
                        <p className="text-center mt-3 px-2">
                          {t("valid-test")}
                        </p>
                      </a>

                      <div>
                        <hr
                          style={{
                            height: "100%",
                            borderRight: "1px solid black",
                            margin: "0",
                          }}
                        ></hr>
                      </div>

                      <a
                        className="px-3 align-items-center d-flex flex-column"
                        style={{ width: "49%" }}
                        href={`${process.env.PUBLIC_URL}/pdf/tampered_certificate.pdf`}
                        download
                      >
                        <img
                          src="../../icons/download_file.svg"
                          alt="Download"
                          width={"50px"}
                          className="downloadBtn"
                        />
                        <p className="text-center mt-3 px-2">
                          {t("tampered-test")}
                        </p>
                      </a>
                    </div>
                  </div>
                  <h4 className="bold-text">{t("test-one-title")}</h4>
                  <div className="mb-5 text-center">{t("test-one-text")}</div>
                </Col>
                <Col className="text-center text-lg-start text-break d-flex flex-column align-items-center">
                  <div
                    className="shadow-sm p-3 mb-4 d-flex justify-content-center bg-body rounded align-items-center "
                    style={{
                      width: "400px",
                      height: "240px",
                      minWidth: "200px",
                      maxWidth: "100%",
                    }}
                  >
                    <img alt="Card" src={demoimage2} />
                  </div>
                  <h4 className="bold-text">{t("test-two-title")}</h4>
                  <div className="mb-5 text-center">{t("test-two-text")}</div>
                </Col>
                <Col className="text-center text-lg-start text-break d-flex flex-column align-items-center">
                  <div
                    className="shadow-sm p-3 mb-4 d-flex justify-content-center bg-body rounded align-items-center "
                    style={{
                      width: "400px",
                      height: "240px",
                      minWidth: "200px",
                      maxWidth: "100%",
                    }}
                  >
                    <img alt="Card" src={demoimage3} />
                  </div>
                  <h4 className="bold-text">{t("test-three-title")}</h4>
                  <div className="mb-5 text-center">
                    {t("test-three-text")}{" "}
                  </div>
                </Col>
              </Row>
              <Row className="little-top-margin"></Row>
            </div>
          </div>
        ) : null}
        <Popup
          title={tr("decrypt-modal-title")}
          body={tr("decrypt-modal-body")}
          firstInput={tr("password")}
          firstInputType="password"
          onChange={onPasswordChange}
          onClick={decryptRecord}
          uiError={uiError}
          onHide={handleClose}
          onShow={show}
        ></Popup>
      </div>
    </Fragment>
  );
};

export default Home;
