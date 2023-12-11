import { Typography } from "antd";

export const EllipsisMiddle: React.FC<{
  lenght: number;
  children?: string;
}> = ({ lenght, children }) => {
  const separator = "...";

  if (children && children.length > lenght) {
    const sepLen = separator.length,
      charsToShow = lenght - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);

    children =
      children.substr(0, frontChars) +
      separator +
      children.substring(children.length - backChars);
  }

  return (
    <Typography.Text copyable style={{ maxWidth: "100%" }}>
      {children}
    </Typography.Text>
  );
};
