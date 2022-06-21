import { Record } from "@bloock/sdk";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import FileSection from "../components/documents/UploadFile";
import VerificationSection from "../components/verification/VerificationMain";
import demoimage3 from "../images/get_results.jpg";
import demoimage2 from "../images/verify_documents.jpg";
import "../styles.css";
import { getCookie } from "../utils/cookie";
import { useFileType } from "../utils/use-file-type";
import { useIsJson } from "../utils/use-is-json";
import { useIsUrl } from "../utils/use-is-url";

export type FileElement = {
  name?: string | null;
  value?: any | null;
  record?: Record | null;
};

const Home = () => {
  const { t } = useTranslation("home");

  const session = getCookie("hasValidated");

  const [element, setElement] = useState<FileElement | null>(null);
  const [validateFromUrl, setValidateFromUrl] = useState<boolean>(false);
  const verificationRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const [errorFetchDocument, setErrorFetchDocument] = useState<boolean>(false);

  async function base64Loader(urlParam: any) {
    urlParam = new URL(urlParam);
    let error;

    const dataQuery = searchParams.get("data");

    console.log(dataQuery, "queryy");

    /*     let decodedString = atob(
      "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G"
    ); */

    let decodedString = atob(dataQuery as any);
    console.log(decodedString);

    if (error === undefined) {
      if (decodedString) {
        setElement({
          name: urlParam.href,
          value: decodedString,
          record: await Record.fromString(decodedString),
        });
      }
    } else {
      setErrorFetchDocument(true);
      setValidateFromUrl(false);
    }
  }

  async function fileLoader(urlParam: any) {
    const isJSONValid = useIsJson;
    const fileDetect = useFileType;

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
      });

    let array = new Uint8Array(bytes != undefined ? bytes : []);
    var string = new TextDecoder().decode(array);

    const dataQuery = searchParams.get("data");

    console.log(dataQuery, "queryy");
    if (error === undefined) {
      if (isJSONValid(string)) {
        setElement({
          name: urlParam.href,
          value: JSON.parse(string),
          record: await Record.fromJSON(JSON.parse(string)),
        });
      } else if (fileDetect(urlParam.href) === "application/pdf") {
        setElement({
          name: urlParam.href,
          value: urlParam.href,
          record: await Record.fromPDF(array),
        });
      } else if (fileDetect(urlParam.href)) {
        setElement({
          name: urlParam.href,
          value: array,
          record: await Record.fromTypedArray(array),
        });
      } else if (dataQuery) {
        console.log("heyy");
        setElement({
          name: "",
          value: dataQuery,
          record: await Record.fromString(dataQuery),
        });
      } else {
        setElement(null);
        setErrorFetchDocument(true);
      }
    } else {
      setErrorFetchDocument(true);
      setValidateFromUrl(false);
    }
  }

  useEffect(() => {
    const recordQuery = searchParams.get("record");
    const dataQuery = searchParams.get("data");

    const isURL = useIsUrl;

    if (isURL(recordQuery)) {
      console.log("record query ");
      fileLoader(recordQuery);
      setValidateFromUrl(true);
    } else if (isURL(dataQuery)) {
      console.log("data query");
      base64Loader(dataQuery);
      setValidateFromUrl(true);
    } else {
      setValidateFromUrl(false);
    }
  }, [searchParams]);

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

            {!element ? (
              <Col>
                <FileSection
                  onElementChange={(element) => setElement(element)}
                  errorFetchDocument={errorFetchDocument}
                  onErrorFetchDocument={(error) => setErrorFetchDocument(error)}
                  element={null}
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
              />
              <FileSection
                onElementChange={(element) => setElement(element)}
                onErrorFetchDocument={(error) => setErrorFetchDocument(error)}
                errorFetchDocument={errorFetchDocument}
                element={element}
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
                        href={`${process.env.PUBLIC_URL}/pdf/valid_certificate.pdf`}
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
      </div>
    </Fragment>
  );
};

export default Home;
