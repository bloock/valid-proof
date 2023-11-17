import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import { Card, Divider } from "antd";

function Information() {
  return (
    <div>
      <div className="my-20 px-20">
        <div className="text-center text-white text-custom-size font-montserrat p-4">
          <p>Test the verification tool</p>
        </div>
        <div className="flex flex-wrap justify-center">
          <Card
            className="m-4 sm:w-72 md:w-80 lg:w-96 xl:w-2/4 sm:h-64 md:h-72 lg:h-80 xl:h-96"
            style={{
              width: "361px",
              height: "320px",
            }}
            bordered={false}
          >
            <div className="flex justify-center mb-4 p-6">
              <div className="flex flex-col items-center mr-10">
                <div
                  className="h-16 w-16 rounded-full bg-blue-500 mb-2 flex items-center justify-center"
                  style={{ backgroundColor: "#0084B8" }}
                >
                  <DownloadOutlined className="text-white text-2xl" />
                </div>
                <p className="text-center text-gray-500">
                  Valid test Certificate
                </p>
              </div>
              <div className="flex flex-col items-center ">
                <div
                  className="h-16 w-16 rounded-full bg-blue-500 mb-2 flex items-center justify-center"
                  style={{ backgroundColor: "#0084B8" }}
                >
                  <DownloadOutlined className="text-white text-2xl" />
                </div>
                <p className="text-center text-gray-500">
                  Tampered test Certificate
                </p>
              </div>
            </div>
            <Divider className="mt-4" />
            <div className="flex flex-col items-center">
              <p className="text-center font-bold text-md">
                Try out with demo documents
              </p>
              <p className="text-center text-sm text-gray-500">
                Download the demo documents to see how it’s done.
              </p>
            </div>
          </Card>

          <Card
            className="m-4 sm:w-72 md:w-80 lg:w-96 xl:w-2/4 sm:h-64 md:h-72 lg:h-80 xl:h-96"
            style={{
              width: "361px",
              height: "320px",
            }}
            bordered={false}
          >
            <div className="flex justify-center mb-4 p-6">
              <div className="flex flex-col items-center">
                <div
                  className="h-16 w-16 rounded-full bg-blue-500 mb-2 flex items-center justify-center"
                  style={{ backgroundColor: "#0084B8" }}
                >
                  <FileProtectOutlined className="text-white text-2xl" />
                </div>
                <p className="text-center text-gray-500">
                  Valid test Certificate
                </p>
              </div>
            </div>
            <Divider className="mt-8" />
            <div className="flex flex-col items-center">
              <p className="text-center font-bold text-md">
                Verify the documents
              </p>
              <p className="text-center text-sm text-gray-500">
                Drag and drop each document into the tool or click on the tool
                to open your file browser.
              </p>
            </div>
          </Card>

          <Card
            className="m-4 sm:w-72 md:w-80 lg:w-96 xl:w-2/4 sm:h-64 md:h-72 lg:h-80 xl:h-96"
            style={{
              width: "361px",
              height: "320px",
            }}
            bordered={false}
          >
            <div className="flex justify-center mb-4 p-6">
              <div className="flex flex-col items-center mr-10">
                <div
                  className="h-16 w-16 rounded-full bg-blue-500 mb-2 flex items-center justify-center"
                  style={{ backgroundColor: "#0084B8" }}
                >
                  <CheckCircleOutlined className="text-white text-2xl" />
                </div>
                <p className="text-center text-gray-500">
                  Valid test Certificate
                </p>
              </div>
              <div className="flex flex-col items-center ">
                <div
                  className="h-16 w-16 rounded-full bg-blue-500 mb-2 flex items-center justify-center"
                  style={{ backgroundColor: "#0084B8" }}
                >
                  <CloseCircleOutlined className="text-white text-2xl" />
                </div>
                <p className="text-center text-gray-500">
                  Tampered test Certificate
                </p>
              </div>
            </div>
            <Divider className="mt-4" />
            <div className="flex flex-col items-center">
              <p className="text-center font-bold text-md">Check the results</p>
              <p className="text-center text-sm text-gray-500">
                Check if the certification is valid and get the evidence report.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Information;
