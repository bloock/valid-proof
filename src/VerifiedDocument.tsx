import { CheckCircleOutlined } from "@ant-design/icons";
import { Card, Steps } from "antd";
import React, { useState } from "react";
import "./styles/index.css";

function VerifiedDocument() {
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    console.log("onChange:", value);
    setCurrent(value);
  };
  //   const description = "This is a description.";

  const { Step } = Steps;

  return (
    <div>
      <div className=" p-4">
        <div className="text-center text-white text-custom-size font-montserrat p-4">
          <p>- VerifiedDocument -</p>
        </div>
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
              <p className="text-left font-bold text-xl mb-12">
                Please, wait for your file to be verified...
              </p>

              <Steps current={current} onChange={onChange} className="p-12">
                <Step
                  title={
                    <div>
                      Retrieving <br />
                      file
                    </div>
                  }
                  status="finish"
                  style={{ color: "#72C040" }}
                  icon={<CheckCircleOutlined />}
                />
                <Step
                  title={
                    <div>
                      Checking Access <br />
                      control
                    </div>
                  }
                  status="finish"
                  style={{ color: "#72C040" }}
                  icon={<CheckCircleOutlined />}
                />
                <Step
                  title={
                    <div>
                      Verifying <br />
                      Authenticity
                    </div>
                  }
                  status="wait"
                  icon={<CheckCircleOutlined />}
                />
                <Step
                  title={
                    <div>
                      Verifying <br />
                      Integrity
                    </div>
                  }
                  status="wait"
                  icon={<CheckCircleOutlined />}
                />
              </Steps>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default VerifiedDocument;
