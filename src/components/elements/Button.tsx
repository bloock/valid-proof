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
  return (
    <button
      className={`button ${className}`}
      style={{ backgroundColor: "var(--primary-bg-color)" }}
      onClick={cta}
    >
      {children}
    </button>
  );
};

export default Button;
