import { LoadingOutlined } from "@ant-design/icons";
import { Card, Steps } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useVerification } from "../providers/VerificationProvider";
import Wrapper from "./Wrapper";

const { Step } = Steps;

export enum VerificationStep {
  RETRIEVING_FILE = "RETRIEVING_FILE",
  CHECKING_ACCESS_CONTROL = "CHECKING_ACCESS_CONTROL",
  VERIFYING_AUTHENTICITY = "VERIFYING_AUTHENTICITY",
  VERIFYING_INTEGRITY = "VERIFYING_INTEGRITY",
}

export enum StepState {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

function Stepper() {
  const { t } = useTranslation();
  const {
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails,
  } = useVerification();
  const [steps, setSteps] = useState<{
    [key: string]: { title: string; state: StepState };
  }>({
    [VerificationStep.RETRIEVING_FILE]: {
      title: t("stepper.retrieving-file"),
      state: StepState.PENDING,
    },
    [VerificationStep.CHECKING_ACCESS_CONTROL]: {
      title: t("stepper.check-encryption"),
      state: StepState.PENDING,
    },
    [VerificationStep.VERIFYING_AUTHENTICITY]: {
      title: t("stepper.verify-authenticity"),
      state: StepState.PENDING,
    },
    [VerificationStep.VERIFYING_INTEGRITY]: {
      title: t("stepper.verify-integrity"),
      state: StepState.PENDING,
    },
  });

  useEffect(() => {
    if (!availabilityDetails) {
      steps[VerificationStep.RETRIEVING_FILE].state = StepState.PROCESSING;
      return;
    } else {
      if (availabilityDetails.error) {
        steps[VerificationStep.RETRIEVING_FILE].state = StepState.ERROR;
      } else {
        steps[VerificationStep.RETRIEVING_FILE].state = StepState.SUCCESS;
      }
    }

    if (!encryptionDetails) {
      steps[VerificationStep.CHECKING_ACCESS_CONTROL].state =
        StepState.PROCESSING;
      return;
    } else {
      if (encryptionDetails.error) {
        steps[VerificationStep.CHECKING_ACCESS_CONTROL].state = StepState.ERROR;
      } else {
        steps[VerificationStep.CHECKING_ACCESS_CONTROL].state =
          StepState.SUCCESS;
      }
    }

    if (!authenticityDetails) {
      steps[VerificationStep.VERIFYING_AUTHENTICITY].state =
        StepState.PROCESSING;
      return;
    } else {
      if (authenticityDetails.error) {
        steps[VerificationStep.VERIFYING_AUTHENTICITY].state = StepState.ERROR;
      } else {
        steps[VerificationStep.VERIFYING_AUTHENTICITY].state =
          StepState.SUCCESS;
      }
    }

    if (!integrityDetails) {
      steps[VerificationStep.VERIFYING_INTEGRITY].state = StepState.PROCESSING;
      return;
    } else {
      if (integrityDetails.error) {
        steps[VerificationStep.VERIFYING_INTEGRITY].state = StepState.ERROR;
      } else {
        steps[VerificationStep.VERIFYING_INTEGRITY].state = StepState.SUCCESS;
      }
    }

    setSteps(steps);
  }, [
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails,
  ]);

  return (
    <Wrapper>
      <div className="w-11/12 lg:w-2/3 p-4">
        <div className="flex justify-center py-24 sm:py-12 md:py-16 lg:py-24">
          <Card
            className="w-full h-full flex flex-col p-4"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            bordered={false}
          >
            <div className="flex flex-col justify-center p-12">
              <p className="text-left text-xl mb-12">{t("stepper.title")}</p>

              <Steps labelPlacement="vertical" className="py-12">
                {Object.keys(steps).map((key) => {
                  const getStatus = () => {
                    switch (steps[key].state) {
                      case StepState.PENDING:
                        return "wait";
                      case StepState.PROCESSING:
                        return "process";
                      case StepState.SUCCESS:
                        return "finish";
                      case StepState.ERROR:
                        return "error";
                    }
                  };

                  return (
                    <Step
                      key={key}
                      title={steps[key].title}
                      status={getStatus()}
                      icon={
                        steps[key].state == StepState.PROCESSING ? (
                          <LoadingOutlined />
                        ) : undefined
                      }
                    />
                  );
                })}
              </Steps>
            </div>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

export default Stepper;
