import { lookup } from "mime-types";

enum FileType {
  "image/jpg",
  "image/png",
  "image/jpeg",
  "image/svg",
  "application/pdf",
  "application/json",
}

export const useFileType = (file: any) => {
  if (file) {
    if (file?.value) {
      let fileEncode = lookup(file.name);

      if (fileEncode) {
        if (Object.values(FileType).includes(fileEncode)) {
          debugger;
          return fileEncode;
        } else {
          return null;
        }
      }
    } else {
      return "application/json";
    }
  } else {
    return null;
  }
};
