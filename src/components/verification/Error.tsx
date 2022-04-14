import { Divider } from "primereact/divider";
import React from "react";
import { FileElement } from "../../pages/Home";
import { Truncate } from "../../utils/truncate";

type VerificationErrorProps = {
  element: FileElement | null;
  errorStep: number | null;
};

const VerificationError: React.FC<VerificationErrorProps> = ({
  element,
  errorStep,
}) => {
  return (
    <>
      {element?.name ? (
        <div className="mb-4">
          <i
            className={`pi pi-file px-1 py-1 click-icon text-secondary ${
              element.name ? "d-inline font-bold" : "d-none"
            }`}
          ></i>
          <span className="mx-2 bold-text">
            {Truncate(element.name as string, 50, "...")}
          </span>
        </div>
      ) : null}
      <div className="mb-3">
        <p className="color-error">
          <i className="pi pi-times-circle px-1 py-1 "></i>
          Your record couldn’t be verified
        </p>
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
        {element?.record && element.record.getHash()}
      </div>
    </>
  );
};

export default VerificationError;
