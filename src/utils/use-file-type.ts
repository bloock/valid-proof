import { lookup } from "mime-types";

enum FileType {
  "image/jpg",
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/pdf",
  "application/json",
  "application/x-msdownload",
}

export const useFileType = (file: any) => {
  if (file) {
    if (file?.value) {
      let fileEncode;
      fileEncode = lookup(file.name);
      if (fileEncode) {
        if (Object.values(FileType).includes(fileEncode)) {
          return fileEncode;
        } else {
          return null;
        }
      }
    } else if (Object.values(FileType).includes(file)) {
      return file;
    } else {
      return null;
    }
  } else {
    return null;
  }
};
