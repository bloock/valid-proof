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
import demoimage1 from "../images/howitworks-1.jpg";
import demoimage2 from "../images/howitworks-2.jpg";
import demoimage3 from "../images/howitworks-3.jpg";
import "../styles.css";
import { useFileType } from "../utils/use-file-type";
import { useIsJson } from "../utils/use-is-json";

export type FileElement = {
  name?: string | null;
  value?: any | null;
  record?: Record | null;
};

const Home = () => {
  const [record, setRecord] = useState<Record | null>(null);
  const [element, setElement] = useState<FileElement | null>(null);
  const [validateFromUrl, setValidateFromUrl] = useState<boolean>(false);

  const verificationRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  console.log(element);

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
      debugger;
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
            <Col style={{ paddingRight: "50px", paddingTop: "10px" }}>
              <h1 className="bold-text title">
                Validate your records on blockchain
              </h1>
              <h3 className="mt-4">
                Open source website to obtain a mathematical evidence proving
                irrefutably the time a record was emitted and its provenance and
                integrity.{" "}
              </h3>
              <ul className="mt-4">
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
                <li className="mt-3">
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

            <Col className="mb-10" style={{ marginBottom: "30px" }}>
              <FileSection
                onElementChange={(element) => setElement(element)}
              ></FileSection>
            </Col>
          </Row>
        )}

        {element ? (
          <div ref={verificationRef}>
            <VerificationSection element={element} />
          </div>
        ) : null}
      </div>

      <div className="top-margin"></div>
      <div className="bg-light">
        <div className="container-md px-4 pt-10 ">
          <h2 className="bold-text title mb-5 text-center pt-6">
            How it works
          </h2>
          <Row className="pt-2">
            <Col
              className="text-center text-lg-start text-break"
              style={{ width: "45%" }}
            >
              <h4 className="bold-text">
                Select the type of record to provide
              </h4>
              <div className="mb-4">
                Select if your data is in document format or in JSON format.
              </div>
              <img
                alt="Card"
                src={demoimage1}
                style={{ width: "400px", minWidth: "200px", maxWidth: "100%" }}
                className="shadow-sm p-3 mb-5 bg-body rounded"
              />
            </Col>
            <Col className="text-center text-lg-start text-break">
              <h4 className="bold-text">Load your record</h4>
              <div className="mb-4">
                Select from your system or write down the record you want to
                validate.
              </div>
              <img
                alt="Card"
                src={demoimage2}
                style={{ width: "400px", minWidth: "200px", maxWidth: "100%" }}
                className="shadow-sm p-3 mb-5 bg-body rounded"
              />
            </Col>
            <Col className="text-center text-lg-start text-break">
              <h4 className="bold-text">Get your results</h4>
              <div className="mb-4">
                Obtain a summarised mathematical evidence proving the
                authenticity and integrity of your record.
              </div>
              <img
                alt="Card"
                src={demoimage3}
                style={{ width: "400px", minWidth: "200px", maxWidth: "100%" }}
                className="shadow-sm p-3 mb-5 bg-body rounded"
              />
            </Col>
          </Row>
          <Row className="little-top-margin"></Row>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
