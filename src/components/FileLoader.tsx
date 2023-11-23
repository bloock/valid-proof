import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  DownloadOutlined,
  FileProtectOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Divider, theme, message, Card } from "antd";
import { useCallback, useEffect } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { useVerification } from "../providers/VerificationProvider";
import Wrapper from "./Wrapper";

const { useToken } = theme;

function FileLoader() {
  const { token } = useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const { onInputChange } = useVerification();

  useEffect(() => {
    const getQueryParam = (name: string) => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      return urlSearchParams.get(name);
    };

    const idParam = getQueryParam("url");
    if (idParam) {
      const url = new URL(idParam);
      onInputChange(url);
    }
  });

  const onDrop = useCallback((files: File[]) => {
    if (files.length === 1) {
      onInputChange(files[0]);
    } else if (files.length > 1) {
      messageApi.error("Only one file is supported");
    } else {
      messageApi.error("No files selected");
    }
  }, []);

  const dropzoneOptions: DropzoneOptions = {
    onDropAccepted: onDrop,
    multiple: false,
  };

  const { getRootProps, getInputProps } = useDropzone({
    ...dropzoneOptions,
    noDrag: true,
  });
  const {
    getRootProps: getRootPropsDrag,
    getInputProps: getInputPropsDrag,
    isDragActive,
  } = useDropzone({ ...dropzoneOptions, noClick: true });

  return (
    <div className="flex flex-col items-center snap-mandatory snap-y scroll-smooth">
      {contextHolder}
      <Wrapper {...getRootPropsDrag()} className="snap-center">
        <div
          className="fixed w-screen h-screen transition-opacity duration-500 ease-in-out flex items-center justify-center"
          style={{
            backgroundColor: token.colorPrimary,
            opacity: isDragActive ? "1" : "0",
            zIndex: isDragActive ? "999" : "0",

            // visibility: isDragActive ? "visible" : "hidden",
            // transition: "opacity 500ms, visibility 500ms",
          }}
        >
          <p
            className="text-0 leading-14 text-white font-bold mb-8"
            style={{ fontSize: "50px", lineHeight: "50px" }}
          >
            Drop files here
          </p>
        </div>
        <div
          className="flex flex-row items-center mx-20 z-50"
          style={{
            height: "26rem",
            opacity: !isDragActive ? "1" : "0",
          }}
        >
          <div
            className="h-full flex flex-col items-center shadow-xl bg-white rounded-lg transition-opacity duration-500 ease-in-out p-4"
            style={{
              minWidth: "15.5rem",
            }}
          >
            <input {...getInputPropsDrag()} />
            <div
              className="w-full flex flex-col items-center cursor-pointer py-10"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div
                className="flex items-center justify-center h-32  h-9 w-9 rounded-full mb-2 p-8 mt-8"
                style={{ backgroundColor: token.colorPrimary }}
              >
                <UploadOutlined className="text-white text-2xl" />
              </div>
              <p className="text-lg mb-4 pt-2 text-center">Select a file</p>
            </div>
            <Divider className="flex-1 m-0" />
            <div className="flex items-center py-8">
              <p className="text-center">X Validate another file</p>
            </div>
          </div>
          <div className="min-h-full flex flex-col justify-center ml-20">
            <p
              className="text-0 leading-14 text-white font-bold mb-8"
              style={{ fontSize: "50px", lineHeight: "50px" }}
            >
              Verify document's authenticity
            </p>
            <p
              className="text-0 leading-14 text-white"
              style={{ fontSize: "30px", lineHeight: "40px" }}
            >
              Unequivocally check whether a document <br />
              has been tampered with
            </p>
          </div>
        </div>
      </Wrapper>
      <DownOutlined
        className="-mt-14 cursor-pointer p-4 text-xl text-white z-50"
        onClick={() => {
          document.querySelector(`#info-section`)?.scrollIntoView();
        }}
      />
      <Wrapper
        id="info-section"
        className="min-h-screen flex items-center snap-center"
      >
        <div className="my-20 px-20">
          <div className="text-center text-white text-custom-size p-4">
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
                    style={{ backgroundColor: token.colorPrimary }}
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
                    style={{ backgroundColor: token.colorPrimary }}
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
                    style={{ backgroundColor: token.colorPrimary }}
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
                    style={{ backgroundColor: token.colorPrimary }}
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
                    style={{ backgroundColor: token.colorPrimary }}
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
                <p className="text-center font-bold text-md">
                  Check the results
                </p>
                <p className="text-center text-sm text-gray-500">
                  Check if the certification is valid and get the evidence
                  report.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

export default FileLoader;
