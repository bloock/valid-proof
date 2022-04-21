import { Record } from "@bloock/sdk";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import FileSection from "../components/documents/UploadFile";
import VerificationSection from "../components/verification/VerificationMain";
import demoimage3 from "../images/get_results.jpg";
import demoimage2 from "../images/verify_documents.jpg";
import "../styles.css";
import { useFileType } from "../utils/use-file-type";
import { useIsJson } from "../utils/use-is-json";

export type FileElement = {
  name?: string | null;
  value?: any | null;
  record?: Record | null;
};

const Home = () => {
  const [element, setElement] = useState<FileElement | null>(null);
  const [validateFromUrl, setValidateFromUrl] = useState<boolean>(false);

  const verificationRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  const primaryColor = (window as any).env.PRIMARY_COLOR
    ? (window as any).env.PRIMARY_COLOR
    : "#07D1B6";

  async function fileLoader(urlParam: any) {
    const isJSONValid = useIsJson;
    const fileDetect = useFileType;

    urlParam = new URL(urlParam);
    let bytes = await axios
      .get(urlParam, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        return Buffer.from(res.data);
      });

    let array = new Uint8Array(bytes);
    var string = new TextDecoder().decode(array);

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
    } else {
      setElement({
        name: urlParam.href,
        value: array,
        record: await Record.fromTypedArray(array),
      });
    }
  }

  useEffect(() => {
    const recordQuery = searchParams.get("record");
    if (recordQuery) {
      setValidateFromUrl(true);
      fileLoader(recordQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log(element);
    if (element && verificationRef && verificationRef.current) {
      verificationRef.current.scrollIntoView();
    }
  }, [verificationRef, element]);

  return (
    <Fragment>
      <div className="top-margin"></div>
      <div className="container-md px-4">
        {!validateFromUrl && (
          <Row className="flex-column flex-lg-row pt-8 align-items-center">
            <Col style={{ paddingRight: "10px", paddingTop: "10px" }}>
              <h1 className="">Verify document's authenticity </h1>
              <h3 className="mt-3">
                Check unequivocally on blockchain whether a document has been
                tampered with
              </h3>
              <ul className="mt-4 features">
                <li className="mt-2">
                  <i
                    className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                    style={{
                      marginRight: "10px",
                      backgroundColor: primaryColor,
                    }}
                  ></i>
                  <p>Get a simple summary of the evidence details</p>
                </li>
                <li className="mt-3">
                  <i
                    className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                    style={{
                      marginRight: "10px",
                      backgroundColor: primaryColor,
                    }}
                  ></i>

                  <p>Verify independently your records on blockchain</p>
                </li>
                <li className=" mt-3">
                  <i
                    className="circle check-success pi pi-check px-1 py-1 click-icon icon-medium"
                    style={{
                      marginRight: "10px",
                      backgroundColor: primaryColor,
                    }}
                  ></i>

                  <p>Completely transparent and opensource</p>
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
        )}

        {element ? (
          <div ref={verificationRef}>
            <VerificationSection element={element} />
            {!validateFromUrl ? (
              <FileSection
                onElementChange={(element) => setElement(element)}
                element={element}
              ></FileSection>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="top-margin"></div>
      <div className="bg-light">
        <div className="container-md px-4 pt-10 ">
          <h2 className="mb-4 text-center pt-5">Test the verification tool</h2>
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
                <div className="d-flex ">
                  <a href="../images/try_out.pdf" download>
                    <div className="px-3 align-items-center d-flex flex-column">
                      <i
                        className="circle check-success pi pi-arrow-down px-3 py-3 click-icon icon-medium"
                        style={{
                          backgroundColor: primaryColor,
                          fontSize: "20px",
                        }}
                      ></i>
                      <p className="text-center mt-3">Valid test certificate</p>
                    </div>
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
                  <div className="px-3 align-items-center d-flex flex-column">
                    <i
                      className="circle check-success pi pi-arrow-down px-3 py-3 click-icon icon-medium"
                      style={{
                        backgroundColor: primaryColor,
                        fontSize: "20px",
                      }}
                    ></i>
                    <p className="text-center mt-3">
                      Tampered test certificate
                    </p>
                  </div>
                </div>
              </div>
              <h4 className="bold-text text-center text-lg-start">
                Try out with demo documents
              </h4>
              <div className="mb-5">
                Download the demo documents or read the demo QR to see how it’s
                done.
              </div>
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
              <h4 className="bold-text">Verify the documents</h4>
              <div className="mb-5">
                Drag and drop each document into the tool or click on the tool
                to open your file browser.
              </div>
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
              <h4 className="bold-text">Check the results</h4>
              <div className="mb-5">
                Check if the certification is valid and get the evidence report.
              </div>
            </Col>
          </Row>
          <Row className="little-top-margin"></Row>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
