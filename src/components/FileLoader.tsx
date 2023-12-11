import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  DownloadOutlined,
  FileProtectOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Divider, theme, message, Card, Row, Col } from "antd";
import { useCallback, useEffect } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { useVerification } from "../providers/VerificationProvider";
import Wrapper from "./Wrapper";
import { useTranslation } from "react-i18next";

const { useToken } = theme;

function FileLoader() {
  const { t } = useTranslation();
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
      messageApi.error(t("home.error.only-one"));
    } else {
      messageApi.error(t("home.error.no-files"));
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
    <div
      className="flex flex-col items-center overflow-y-scroll snap-mandatory snap-y scroll-smooth"
      style={{
        scrollSnapType: "y proximity",
        scrollPaddingTop: "15vh",
      }}
    >
      {contextHolder}
      <Wrapper {...getRootPropsDrag()} className="snap-center">
        <div
          className="fixed w-screen h-screen transition-opacity duration-500 ease-in-out flex items-center justify-center"
          style={{
            backgroundColor: token.colorPrimary,
            opacity: isDragActive ? "1" : "0",
            zIndex: isDragActive ? "999" : "0",
          }}
        >
          <p
            className="text-0 leading-14 text-white font-bold mb-8"
            style={{ fontSize: "50px", lineHeight: "50px" }}
          >
            {t("home.drop.drop-here")}
          </p>
        </div>

        <Row
          className="mx-20 z-50"
          style={{
            opacity: !isDragActive ? "1" : "0",
          }}
          gutter={[16, 16]}
          justify="center"
          align="middle"
        >
          <Col lg={8} md={24}>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div
                className="h-full flex flex-col items-center shadow-xl bg-white rounded-lg transition-opacity duration-500 ease-in-out p-4"
                style={{
                  width: "15.5rem",
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
                  <p className="text-lg mb-4 pt-2 text-center">
                    {t("home.drop.select-file")}
                  </p>
                </div>
                <Divider className="flex-1 m-0" />
                <div className="flex items-center py-8">
                  <p className="text-center">{t("home.drop.subtitle")}</p>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={16} md={24}>
            <div className="min-h-full flex flex-col justify-center">
              <p
                className="text-0 leading-14 text-white font-bold mb-8"
                style={{ fontSize: "50px", lineHeight: "50px" }}
              >
                {t("home.title")}
              </p>
              <p
                className="text-0 leading-14 text-white"
                style={{ fontSize: "30px", lineHeight: "40px" }}
              >
                {t("home.subtitle")}
              </p>
            </div>
          </Col>
        </Row>
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
            <p>{t("home.information.title")}</p>
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
                    {t("home.information.title")}
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
                  {t("home.information.try-out.title")}
                </p>
                <p className="text-center text-sm text-gray-500">
                  {t("home.information.try-out.subtitle")}
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
                  {t("home.information.verify-documents.title")}
                </p>
                <p className="text-center text-sm text-gray-500">
                  {t("home.information.verify-documents.subtitle")}
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
                  {t("home.information.check-results.title")}
                </p>
                <p className="text-center text-sm text-gray-500">
                  {t("home.information.check-results.subtitle")}
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
