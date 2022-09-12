import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("error");

  return (
    <>
      {element?.name ? (
        <div
          className={
            element.name ? "mb-4 mt-2 d-flex align-items-center" : "mb-0"
          }
        >
          <i
            className={`pi pi-file px-1 py-1 click-icon text-secondary ${
              element.name ? "d-inline" : "d-none"
            }`}
            style={{ fontWeight: 300 }}
          ></i>
          <span className="mx-1 text-secondary text-break">
            {Truncate(element.name as string, 30, "...")}
          </span>
        </div>
      ) : null}
      <div className="mb-4 alert alert-danger">
        <p className="font-bold d-flex align-items-center ">
          <i
            className="pi pi-times-circle px-2 py-1 "
            style={{ fontSize: "1rem" }}
          ></i>
          {t("recordError")}
        </p>
      </div>

      {errorStep === 0 ? (
        <div>
          <p className="pb-3">{t("error-description")}</p>
          <p>
            {t("sources")}
            <ul>
              <li> {t("first-source")}</li>
              <li>{t("second-source")}</li>
              <li>{t("third-source")}</li>
            </ul>
          </p>
        </div>
      ) : (
        <div>
          <p>
            {t("sources")}
            <ul>
              <li>{t("fourth-source")}</li>
              <li>{t("fifth-source")}</li>
            </ul>
          </p>
          <p>{t("try-again")}</p>
        </div>
      )}
    </>
  );
};

export default VerificationError;
