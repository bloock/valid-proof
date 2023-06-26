import filetype from "magic-bytes.js";

export const getFileType = (file: Uint8Array) => {
  try {
    let type = filetype(file);
    if (type.length > 0) {
      return type[0].mime || null;
    }

    const arrayBuffer = new Uint8Array(file).buffer;
    let decodedString = new TextDecoder().decode(arrayBuffer);
    decodedString = decodedString.replace(/[\u0000-\u0019]+/g, "");
    if (decodedString) {
      JSON.parse(decodedString);
    }
    return "application/json";
  } catch (e) {
    return null;
  }
};
