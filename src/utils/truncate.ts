export const Truncate = (
  fullStr: string,
  strLen: number,
  separator: string
) => {
  if (!fullStr || fullStr.length <= strLen) return fullStr;

  separator = separator || "...";

  const sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};
