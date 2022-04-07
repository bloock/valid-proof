import { Record } from "@bloock/sdk";
import { Divider } from "primereact/divider";
import React from "react";
import { Col } from "react-bootstrap";

type VerificationSuccessProps = {
  fileName: string | null;
  record: Record;
  errorStep: number | null;
};

const VerificationError: React.FC<VerificationSuccessProps> = ({
  fileName,
  record,
  errorStep,
}) => {
  return (
    <Col md={6}>
      <div className={fileName ? "mb-4" : "mb-0"}>
        <i
          className=" pi pi-file px-1 py-1 click-icon "
          style={
            fileName
              ? {
                  display: "inline",
                  color: "#495057",
                  fontSize: "1.3rem",
                  fontWeight: 100,
                }
              : {
                  display: "none",
                  color: "#495057",
                  fontSize: "1.3rem",
                  fontWeight: 100,
                }
          }
        ></i>
        <span className="mx-2 bold-text">{fileName}</span>
      </div>

      {errorStep === 0 ? (
        <div>
          <p className="pb-3">
            There’s no proof of existence for this record. It might have been
            modified unintentionally.
          </p>
          <p>
            Potential error sources:
            <ul>
              <li>- The issuer provided an altered version of the record.</li>
              <li>
                - The record was altered by a malicious third party during
                transmission.
              </li>
              <li>- The record was unintentionally altered.</li>
            </ul>
          </p>
          <p>
            If you have any questions, please contact the issuer of the records
            directly or get in touch with our support.
          </p>
        </div>
      ) : (
        <div>
          <p>
            Potential error sources:
            <ul>
              <li>- You were provided a fraudulent proof by the issuer.</li>
              <li>
                - Your record is still pending to be transacted into a
                blockchain protocol by the issuer.
              </li>
            </ul>
          </p>
          <p>Please try loading your record again in a few minutes.</p>
        </div>
      )}
      <Divider className="my-4" />
      <div className="bold-text">Document hash</div>
      <div className="" style={{ overflowWrap: "break-word" }}>
        {record && record.getHash()}
      </div>
    </Col>
  );
};

export default VerificationError;
