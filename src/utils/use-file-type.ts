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
  const isJSONValid = useIsJson;
  if (file) {
    if (file?.value) {
      let fileEncode = lookup(file.name);

      if (fileEncode) {
        if (Object.values(FileType).includes(fileEncode)) {
          return fileEncode;
        } else {
          return null;
        }
      }
    } else if (isJSONValid(file) === true) {
      return "application/json";
    } else {
      return null;
    }
  } else {
    return null;
  }
};
