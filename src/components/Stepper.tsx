import { Card, Steps } from "antd";
import Wrapper from "./Wrapper";
import { useVerification } from "../providers/VerificationProvider";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
const { Step } = Steps;

export enum VerificationStep {
  RETRIEVING_FILE = "RETRIEVING_FILE",
  CHECKING_ACCESS_CONTROL = "CHECKING_ACCESS_CONTROL",
  VERIFYING_AUTHENTICITY = "VERIFYING_AUTHENTICITY",
  VERIFYING_INTEGRITY = "VERIFYING_INTEGRITY",
}

function Stepper() {
  const { t } = useTranslation();
  const {
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails,
  } = useVerification();
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      id: VerificationStep.RETRIEVING_FILE,
      title: t("stepper.retrieving-file"),
    },
    {
      id: VerificationStep.CHECKING_ACCESS_CONTROL,
      title: t("stepper.check-encryption"),
    },
    {
      id: VerificationStep.VERIFYING_AUTHENTICITY,
      title: t("stepper.verify-authenticity"),
    },
    {
      id: VerificationStep.VERIFYING_INTEGRITY,
      title: t("stepper.verify-integrity"),
    },
  ];

  useEffect(() => {
    const getCurrentStep = (): number => {
      if (!availabilityDetails) {
        return steps.findIndex(
          (s) => s.id === VerificationStep.RETRIEVING_FILE
        );
      }

      if (!encryptionDetails) {
        return steps.findIndex(
          (s) => s.id === VerificationStep.CHECKING_ACCESS_CONTROL
        );
      }

      if (!authenticityDetails) {
        return steps.findIndex(
          (s) => s.id === VerificationStep.VERIFYING_AUTHENTICITY
        );
      }

      if (!integrityDetails) {
        return steps.findIndex(
          (s) => s.id === VerificationStep.VERIFYING_INTEGRITY
        );
      }

      return 0;
    };

    setCurrent(getCurrentStep());
  }, [
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails,
  ]);

  return (
    <Wrapper>
      <div className="p-4">
        <div className="flex justify-center py-24 sm:py-12 md:py-16 lg:py-24">
          <Card
            className="w-full h-full flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 xl:p-10"
            style={{
              width: "auto",
              height: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            bordered={false}
          >
            <div className="flex flex-col justify-center p-12">
              <p className="text-left text-xl mb-12">{t("stepper.title")}</p>

              <Steps
                current={current}
                labelPlacement="vertical"
                className="py-12"
              >
                {steps.map((s, idx) => (
                  <Step
                    key={s.id}
                    title={s.title}
                    icon={idx == current ? <LoadingOutlined /> : undefined}
                  />
                ))}
              </Steps>
            </div>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

export default Stepper;
