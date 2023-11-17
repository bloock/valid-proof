import { Card, Form } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";

function DecryptFileUpload() {
  const props: UploadProps = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div>
      <div className=" p-4">
        <div className="text-center text-white text-custom-size font-montserrat p-4">
          <p>- DecryptFile -</p>
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
              <p className="text-left font-bold text-xl mb-4">Decrypt File</p>
              <p className="text-left text-lg text-gray-500">
                Please, introduce your{" "}
                <strong className="font-bold">Certificate</strong>, <br />
                to decrypt the file and continue with the validation process.
              </p>
              <Form
                className="mb-4 w-full p-2 py-8 flex flex-col items-center"
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
              >
                <Form.Item
                  className="mb-4 w-full"
                  name="Upload"
                  label="Upload archive"
                  rules={[{ required: true }]}
                >
                  <Upload {...props}>
                    <Button
                      icon={<UploadOutlined />}
                      className="w-40 h-40 bg-white"
                      style={{ width: "750px", height: "50px" }}
                    >
                      Click to Upload
                    </Button>
                  </Upload>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DecryptFileUpload;
