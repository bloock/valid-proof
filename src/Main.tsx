import { UploadOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { useDropzone } from "react-dropzone";

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
        className="absolute top-0 left-10 w-full h-full p-4"
      >
        <div
          className="w-screen h-screen z-50 transition-opacity duration-500 ease-in-out"
          style={{
            backgroundColor: "#0084B8",
            opacity: isDragActive ? "1" : "0",
          }}
        ></div>
        <div
          className="flex flex-col items-center absolute top-1/2 left-20 shadow-xl bg-white rounded-lg transition-opacity duration-500 ease-in-out p-4"
          style={{
            height: "26rem",
            width: "15.5rem",
            marginTop: "-12.5em",
            opacity: !isDragActive ? "1" : "0",
          }}
        >
          <input {...getInputPropsDrag()} />
          <div
            className="w-full flex flex-col items-center cursor-pointer p-10"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div
              className="flex items-center justify-center h-32  h-9 w-9 rounded-full mb-2 p-8 mt-8"
              style={{ backgroundColor: "#0084B8" }}
            >
              <UploadOutlined className="text-white text-2xl" />
            </div>
            <p className="text-lg mb-4 pt-2">Select a file</p>
          </div>
          <Divider className="mt-8" />
          <p className="text-center mt-8">X Validate another file</p>
        </div>
        <p
          className="absolute top-1/3 left-[calc(15rem+5rem+5rem)] text-0 leading-14 tracking-[0.01em] w-[calc(600*var(--scale))] min-w-350px text-white font-montserrat font-bold mb-8 "
          style={{ fontSize: "50px", lineHeight: "50px" }}
        >
          Verify document's authenticity
        </p>
        <p
          className="absolute top-1/2 left-[calc(15rem+5rem+5rem)] text-0 leading-14 tracking-[0.01em] w-[calc(600*var(--scale))] min-w-300px text-white font-montserrat"
          style={{ fontSize: "30px", lineHeight: "40px" }}
        >
          Unequivocally check whether a document <br />
          has been tampered with
        </p>
      </div>
    </>
  );
}

export default Main;
