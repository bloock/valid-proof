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
    let fileEncode;
    if (file?.value) {
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
      fileEncode = lookup(file);
      if (fileEncode) {
        if (Object.values(FileType).includes(fileEncode)) {
          return fileEncode;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  } else {
    return null;
  }
};
