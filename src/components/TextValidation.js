import React, { useMemo, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDropzone } from "react-dropzone";
import "../customstyles.css";
import { Button } from "bootstrap";
import DragAndDrop from "./DragAndDrop";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  height: "250px",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const TextValidation = (props) => {
  const { isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: "image/*",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const handleSubmission = (e) => {
    //integrate SDK to send the data
    selectedFile
      ? console.log(selectedFile, "selected sent thru sdk")
      : acceptedFiles
      ? console.log(acceptedFiles, "dragged sent thru sdk")
      : console.log("nothing to send");

    setTimeout(() => {
      setIsFilePicked(false);
    }, 2000);
  };

  const handleChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsFilePicked(true);
  };

  const handleDeleteSelected = (e) => {
    setIsFilePicked(false);
  };

  return (
    <section>
      <div className="container" {...getRootProps({ style })}>
        <div className="vertical-center horizontal-center">
          <div>
            {isFilePicked || acceptedFiles.length > 0 ? (
              <div>
                <span>
                  {" "}
                  {selectedFile
                    ? selectedFile.name
                    : acceptedFiles[0].name}{" "}
                </span>
                <span onClick={handleDeleteSelected}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    class="bi bi-x"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </span>

                <div className="mt-3">
                  <button className="button" onClick={handleSubmission}>
                    Certificate
                  </button>
                </div>

                <i className="bi bi-x bi-4x" onClick={handleDeleteSelected}></i>
              </div>
            ) : (
              <div className="button">
                <input
                  className=""
                  type="file"
                  name="file"
                  id="file"
                  onChange={handleChange}
                />
                <label for="file">Select file</label>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextValidation;
