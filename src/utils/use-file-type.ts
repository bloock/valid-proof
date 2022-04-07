import { lookup } from "mime-types";
import { useIsJson } from "./use-is-json";

enum FileType {
  "image/jpg",
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/pdf",
  "application/json",
}

export const useFileType = (file: any) => {
  const isJSONValid = useIsJson(file);
  if (file) {
    if (file?.value) {
      let fileEncode;
      if (file.value["content-type"]) {
        let arrayContentType = file.value["content-type"].split(";");
        fileEncode = arrayContentType[0];
      } else {
        fileEncode = lookup(file.name);
      }
      if (fileEncode) {
        if (Object.values(FileType).includes(fileEncode)) {
          return fileEncode;
        } else {
          return null;
        }
      }
    } else if (isJSONValid === true) {
      return "application/json";
    } else {
      return null;
    }
  } else {
    return null;
  }
};
