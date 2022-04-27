import React from "react";

type ButtonProps = {
  children?: any;
  cta?: () => void;
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  cta = () => {},
  disabled,
  className,
}) => {
  const primaryColor = (window as any).env.PRIMARY_COLOR
    ? (window as any).env.PRIMARY_COLOR
    : "#07D1B6";

  return (
    <button
      className={`button ${className}`}
      style={{ backgroundColor: primaryColor }}
      onClick={cta}
    >
      {children}
    </button>
  );
};

export default Button;
