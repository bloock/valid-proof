import { Record } from "@bloock/sdk";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useDropzone } from "react-dropzone";
import "../../styles.css";
import { useFileType } from "../../utils/use-file-type";

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
  const [selectedFile, setSelectedFile] = useState<{
    name: string | undefined;
    value: string | ArrayBuffer | null;
  } | null>(null);

  const fileTypeDetect = useFileType;

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
    onElementChange(selectedFile);
    onFileChange(selectedFile?.name ? selectedFile.name : null);
  }, [currentRecord, selectedFile]);

  function fileToBytes(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        let arraybuffer = reader.result;
        if (arraybuffer) {
          let bytes = new Uint8Array(arraybuffer as ArrayBuffer);
          resolve(bytes);
        } else {
          reject();
        }
      };
      reader.onerror = function () {
        reject();
      };
      reader.readAsArrayBuffer(file);
    });
  }

  function fileToJSON(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        try {
          resolve(JSON.parse(reader.result as string));
        } catch {
          reject();
        }
      };
      reader.onerror = function () {
        reject();
      };
      reader.readAsText(file);
    });
  }

  const handleFileChange = async (file: File | null) => {
    if (file != null) {
      let fileType = fileTypeDetect(file.type);

      switch (fileType) {
        case "application/pdf":
          setCurrentRecord(await Record.fromPDF(await fileToBytes(file)));
          setSelectedFile({ name: file?.name, value: await fileToBytes(file) });
          break;
        case "application/json":
          setCurrentRecord(await Record.fromJSON(await fileToJSON(file)));
          setSelectedFile({
            name: file?.name,
            value: await fileToJSON(file),
          });

          break;
        default:
          setCurrentRecord(Record.fromTypedArray(await fileToBytes(file)));
          setSelectedFile({
            name: file?.name,
            value: await fileToBytes(file),
          });

          break;
      }
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
    </Tabs>
  );
};

export default FileSection;
