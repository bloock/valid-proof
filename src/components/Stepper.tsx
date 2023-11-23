import { Card, Steps } from "antd";
import Wrapper from "./Wrapper";
import { useVerification } from "../providers/VerificationProvider";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
const { Step } = Steps;

export enum VerificationStep {
  RETRIEVING_FILE = "RETRIEVING_FILE",
  CHECKING_ACCESS_CONTROL = "CHECKING_ACCESS_CONTROL",
  VERIFYING_AUTHENTICITY = "VERIFYING_AUTHENTICITY",
  VERIFYING_INTEGRITY = "VERIFYING_INTEGRITY",
}

function Stepper() {
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
      title: "Retrieving file",
    },
    {
      id: VerificationStep.CHECKING_ACCESS_CONTROL,
      title: "Checking Access control",
    },
    {
      id: VerificationStep.VERIFYING_AUTHENTICITY,
      title: "Verifying Authenticity",
    },
    {
      id: VerificationStep.VERIFYING_INTEGRITY,
      title: "Verifying Integrity",
    },
  ];

  useEffect(() => {
    if (!availabilityDetails) {
      setCurrent(
        steps.findIndex((s) => s.id === VerificationStep.RETRIEVING_FILE)
      );
    }

    if (!encryptionDetails) {
      setCurrent(
        steps.findIndex(
          (s) => s.id === VerificationStep.CHECKING_ACCESS_CONTROL
        )
      );

      return;
    }

    if (!authenticityDetails) {
      setCurrent(
        steps.findIndex((s) => s.id === VerificationStep.VERIFYING_AUTHENTICITY)
      );

      return;
    }

    if (!integrityDetails) {
      setCurrent(
        steps.findIndex((s) => s.id === VerificationStep.VERIFYING_INTEGRITY)
      );

      return;
    }
  }, [
    integrityDetails,
    authenticityDetails,
    encryptionDetails,
    availabilityDetails,
  ]);

  return (
    <Wrapper>
      <div className=" p-4">
        <div className="flex flex-wrap justify-center">
          <Card
            className="m-10 sm:w-72 md:w-80 lg:w-96 xl:w-2/4 sm:h-64 md:h-72 lg:h-80 xl:h-96"
            style={{
              width: "1000px",
              height: "400px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            bordered={false}
          >
            <div className="flex flex-col justify-center p-12">
              <p className="text-left text-xl mb-12">
                Please, wait for your file to be verified...
              </p>

              <Steps
                current={current}
                labelPlacement="vertical"
                className="py-12"
              >
                {steps.map((s, idx) => (
                  <Step
                    key={s.id}
                    title={s.title}
                    icon={
                      current === idx ? (
                        <LoadingOutlined />
                      ) : (
                        <LoadingOutlined />
                      )
                    }
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
