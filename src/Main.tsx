import { UploadOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import Dropzone, { useDropzone } from "react-dropzone";

function Main() {
  const { getRootProps, getInputProps } = useDropzone({ noDrag: true });
  const {
    getRootProps: getRootPropsDrag,
    getInputProps: getInputPropsDrag,
    isDragActive,
  } = useDropzone({ noClick: true });

  return (
    <>
      <div
        {...getRootPropsDrag()}
        className="absolute top-0 left-0 w-full h-full"
      >
        <div
          className="w-screen h-screen z-50 transition-opacity duration-500 ease-in-out"
          style={{
            backgroundColor: "#5268ff",
            opacity: isDragActive ? "1" : "0",
          }}
        ></div>
        <div
          className="flex flex-col items-center absolute top-1/2 left-20 shadow-xl bg-white rounded-lg transition-opacity duration-500 ease-in-out"
          style={{
            height: "22rem",
            width: "15.5rem",
            marginTop: "-12.5em",
            opacity: !isDragActive ? "1" : "0",
          }}
        >
          <input {...getInputPropsDrag()} />
          <div
            className="w-full flex flex-row items-center justify-center h-32 cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div
              className="flex items-center justify-center h-9 w-9 rounded-full mr-4"
              style={{ backgroundColor: "#5268ff" }}
            >
              <UploadOutlined className="text-white" />
            </div>
            <p className="text-lg">Select a file</p>
          </div>
          <Divider className="my-0 mb-6" />
          <p className="text-center px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <p
          className="absolute top-1/3"
          style={{
            left: "calc(15.5rem + 5rem + 5rem)",
            fontSize: "48px",
            lineHeight: "52px",
            letterSpacing: "-0.01em",
            width: "calc(600 * var(--scale))",
            minWidth: "350px",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
      </div>
    </>
  );
}

export default Main;
