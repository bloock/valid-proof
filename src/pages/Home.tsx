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

  const [element, setElement] = useState<FileElement | null>(null);
  const [validateFromUrl, setValidateFromUrl] = useState<boolean>(false);

  const verificationRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const yOffset = -10;

  const primaryColor = (window as any).env.PRIMARY_COLOR
    ? (window as any).env.PRIMARY_COLOR
    : "#07D1B6";

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
        error = true;
        return undefined;
      });

    let array = new Uint8Array(bytes != undefined ? bytes : []);
    var string = new TextDecoder().decode(array);

    if (!error) {
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
      } else {
        setValidateFromUrl(false);
      }
    } else {
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

  useEffect(() => {
    if (element && verificationRef && verificationRef.current) {
      const id: string = "scoll-offset";
      const yOffset: number = -80;
      const div: HTMLElement | null = document.getElementById(id);
      const y =
        (div as HTMLElement).getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [verificationRef, element]);

  return (
    <Fragment>
      <div className="top-margin"></div>
      <div className="container-md pt-6 px-4">
        <Row className="flex-column flex-lg-row align-items-center">
          <Col style={{ paddingRight: "10px", paddingTop: "10px" }}>
            <h1 className="">{t("title")}</h1>
            <h3 className="mt-3">{t("subtitle")}</h3>
            <ul className="mt-4 features">
              <li className="mt-2">
                <i
                  className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                  style={{
                    marginRight: "10px",
                    backgroundColor: primaryColor,
                  }}
                ></i>
                <p>{t("feature-one")}</p>
              </li>
              <li className="mt-3">
                <i
                  className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                  style={{
                    marginRight: "10px",
                    backgroundColor: primaryColor,
                  }}
                ></i>

                <p>{t("feature-two")}</p>
              </li>
              <li className=" mt-3">
                <i
                  className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                  style={{
                    marginRight: "10px",
                    backgroundColor: primaryColor,
                  }}
                ></i>

                <p>{t("feature-three")}</p>
              </li>
            </ul>
          </Col>

          {!element ? (
            <Col className="mb-10" style={{ marginBottom: "30px" }}>
              <FileSection
                onElementChange={(element) => setElement(element)}
                element={null}
              ></FileSection>
            </Col>
          ) : null}
        </Row>

        {element ? (
          <div ref={verificationRef} id="scoll-offset">
            <VerificationSection element={element} />
            <FileSection
              onElementChange={(element) => setElement(element)}
              element={element}
            ></FileSection>
          </div>
        ) : null}
      </div>

      <div className="top-margin"></div>
      <div className="bg-light">
        <div className="container-md px-4 pt-10 ">
          <h2 className="mb-4 text-center pt-5">{t("test-section")}</h2>
          <Row className="pt-2">
            <Col className="text-center text-lg-start text-break d-flex flex-column align-items-center">
              <div
                className="shadow-sm p-3 mb-4 d-flex justify-content-center bg-body  rounded align-items-center  "
                style={{
                  width: "400px",
                  height: "240px",
                  minWidth: "200px",
                  maxWidth: "100%",
                }}
              >
                <div className="d-flex">
                  <a
                    className="px-3 align-items-center d-flex flex-column"
                    href={`${process.env.PUBLIC_URL}/pdf/valid_certificate.pdf`}
                    download
                  >
                    <i
                      className="circle check-success pi pi-arrow-down px-3 py-3 click-icon icon-medium"
                      style={{
                        backgroundColor: primaryColor,
                        fontSize: "20px",
                      }}
                    ></i>
                    <p className="text-center mt-3">{t("valid-test")}</p>
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
                    href={`${process.env.PUBLIC_URL}/pdf/valid_certificate.pdf`}
                    download
                  >
                    <i
                      className="circle check-success pi pi-arrow-down px-3 py-3 click-icon icon-medium"
                      style={{
                        backgroundColor: primaryColor,
                        fontSize: "20px",
                      }}
                    ></i>
                    <p className="text-center mt-3">{t("tampered-test")}</p>
                  </a>
                </div>
              </div>
              <h4 className="bold-text w-100 text-md-left text-lg-start">
                {t("test-one-title")}
              </h4>
              <div className="mb-5">{t("test-one-text")}</div>
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
              <h4 className="bold-text w-100 text-md-left">
                {t("test-two-title")}
              </h4>
              <div className="mb-5">{t("test-two-text")}</div>
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
              <h4 className="bold-text w-100 text-md-left">
                {t("test-three-title")}
              </h4>
              <div className="mb-5">{t("test-three-text")} </div>
            </Col>
          </Row>
          <Row className="little-top-margin"></Row>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
