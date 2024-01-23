import { Typography } from "antd";

export const EllipsisMiddle: React.FC<{
  length: number;
  value?: string;
  children?: string;
}> = ({ length, value, children }) => {
  const separator = "...";

  if (!value) {
    value = children;
  }

  const copyable = value != children || (children && children.length > length);

  if (children && children.length > length) {
    const sepLen = separator.length,
      charsToShow = length - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);

    children =
      children.substr(0, frontChars) +
      separator +
      children.substring(children.length - backChars);
  }

  return (
    <Typography.Text
      copyable={copyable ? { text: value } : false}
      style={{ maxWidth: "100%" }}
    >
      {children}
    </Typography.Text>
  );
};
