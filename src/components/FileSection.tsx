import { Record } from "@bloock/sdk";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useDropzone } from "react-dropzone";
import "../styles.css";
import { useIsJson } from "../utils/use-is-json";

type FileSectionProps = {
  onFileChange: (name: string | null) => any;
  onRecordChange: (record: Record | null) => any;
  onElementChange: (element: any) => any;
};

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

const FileSection: React.FC<FileSectionProps> = ({
  onRecordChange = () => {},
  onElementChange = () => {},
  onFileChange = () => {},
}) => {
  const [currentRecord, setCurrentRecord] = useState<Record | null>(null);
  const [selectedJSON, setSelectedJSON] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    value: string | ArrayBuffer | null;
  } | null>(null);

  const isJSONValid = useIsJson;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length >= 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, []);

  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({ onDrop });

  useEffect(() => {
    onRecordChange(currentRecord);
    onElementChange(selectedJSON || selectedFile);
    onFileChange(selectedFile?.name ? selectedFile.name : null);
  }, [currentRecord, selectedFile, selectedJSON]);

  const handleJSONChange = (json: string | null) => {
    setCurrentRecord(null);
    setSelectedJSON("");

    if (json != null) {
      setSelectedJSON(json);
    }
  };

  const handleJSONSubmit = () => {
    try {
      let object = JSON.parse(selectedJSON);
      if (object) {
        const record = Record.fromObject(object);
        setCurrentRecord(record);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = (file: File | null) => {
    setCurrentRecord(null);
    setSelectedFile(null);

    if (file != null) {
      const fileReader = new FileReader();
      if (file) {
        fileReader.readAsDataURL(file);
      }
      fileReader.onload = () => {
        setSelectedFile({
          name: file.name,
          value: fileReader.result,
        });
      };
    }
  };

  const handleFileSubmit = () => {
    if (selectedFile != null && typeof selectedFile.value == "string") {
      const record = Record.fromString(selectedFile.value);
      setCurrentRecord(record);
    }
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <Tabs defaultActiveKey="text" className="mb-3 nav-fill">
      <Tab eventKey="text" title="File format">
        <section>
          <div className="container" {...getRootProps({ style: style as any })}>
            <div className="vertical-center horizontal-center">
              <div>
                {selectedFile ? (
                  <div>
                    <div>
                      <span>
                        {selectedFile && selectedFile !== undefined
                          ? selectedFile.name
                          : null}
                      </span>
                      <span onClick={() => handleFileChange(null)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="bi bi-x"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                      </span>
                    </div>

                    <div className="mt-3">
                      <div>
                        {currentRecord ? (
                          <button
                            className="button"
                            onClick={() => handleFileChange(null)}
                            style={{ border: "none" }}
                          >
                            Validate another file
                          </button>
                        ) : (
                          <button
                            className="button"
                            onClick={() => handleFileSubmit()}
                            style={{ border: "none" }}
                            type="submit"
                          >
                            Validate file
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>Drag and drop your file</p>
                    <p>or</p>

                    <div className="button mt-1">
                      <input {...getInputProps()} />
                      <label htmlFor="file">Select file</label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </Tab>
      <Tab eventKey="json" title="JSON format">
        <div>
          <div className="mb-3 d-flex flex-column align-items-center">
            <Form.Control
              as="textarea"
              placeholder={"Paste your JSON here"}
              rows={10}
              value={selectedJSON}
              onChange={(e) => handleJSONChange(e.target.value)}
            />
            <div>
              {currentRecord ? (
                <button
                  className="button mt-3"
                  onClick={() => handleJSONChange(null)}
                  style={{ border: "none" }}
                >
                  Validate another JSON
                </button>
              ) : (
                <div className="mt-2 text-center" style={{ height: "100px" }}>
                  <div
                    className={`${
                      isJSONValid(selectedJSON) === false
                        ? "visible"
                        : "invisible"
                    }`}
                  >
                    <p> Please introduce a valid JSON for the validation </p>{" "}
                  </div>

                  <button
                    className="button mt-2 validateButton"
                    style={{ border: "none" }}
                    onClick={() => handleJSONSubmit()}
                    type="submit"
                    disabled={isJSONValid(selectedJSON) === false}
                  >
                    Validate JSON
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tab>
    </Tabs>
  );
};

export default FileSection;
