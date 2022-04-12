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

const Home = () => {
  const [record, setRecord] = useState<Record | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [element, setElement] = useState<string | null | any>(null);
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
        setFileName(urlParam.path);
        return Buffer.from(res.data);
      });

    let array = new Uint8Array(bytes);
    var string = new TextDecoder().decode(array);

    if (isJSONValid(string)) {
      setRecord(await Record.fromJSON(JSON.parse(string)));
      setElement({ name: urlParam.href, value: JSON.parse(string) });
    } else if (fileDetect(urlParam.href) === "application/pdf") {
      setRecord(await Record.fromPDF(array));
      setElement({ name: urlParam.href, value: urlParam.href });
    } else {
      setRecord(await Record.fromTypedArray(array));
      setElement({ name: urlParam.href, value: array });
    }
    return;
  }

  useEffect(() => {
    const recordQuery = searchParams.get("record");
    if (recordQuery) {
      setValidateFromUrl(true);
      fileLoader(recordQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (record && verificationRef && verificationRef.current) {
      verificationRef.current.scrollIntoView();
    }
  }, [verificationRef, record]);

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
                onFileChange={(fileName) => setFileName(fileName)}
                onRecordChange={(record) => setRecord(record)}
                onElementChange={(element) => setElement(element)}
              ></FileSection>
            </Col>
          </Row>
        )}

        {record ? (
          <div ref={verificationRef}>
            <VerificationSection
              record={record}
              fileName={fileName}
              element={element}
            />
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
