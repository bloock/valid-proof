import filetype from "magic-bytes.js";

enum FileType {
  "image/jpg",
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/pdf",
  "application/json",
  "application/x-msdownload",
}

export const getFileType = (file: Uint8Array) => {
  try {
    let type = filetype(file);
    if (type.length > 0) {
      return type[0].mime || null;
    }

    JSON.parse(new TextDecoder().decode(file));
    return "application/json";
  } catch (e) {
    return null;
  }
};
