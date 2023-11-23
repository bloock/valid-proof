import { PropsWithChildren } from "react";

function Wrapper({
  children,
  className,
  style,
  ...props
}: PropsWithChildren<any>) {
  return (
    <div
      {...props}
      className={`w-full min-h-screen flex flex-row items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}

export default Wrapper;
