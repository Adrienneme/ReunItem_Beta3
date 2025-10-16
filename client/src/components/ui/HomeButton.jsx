import React from "react";
import { Link } from "react-router-dom";

const Button = ({ to, children, color = "green", size = "lg" }) => {
  const baseStyle =
    "inline-block rounded-2xl font-semibold focus:outline-none transition duration-200 text-center whitespace-nowrap overflow-hidden text-ellipsis";

  const colorStyle = color === "green"
      ? "bg-gradient-to-b from-[#56B4D3] to-[#348F50]"
      : color === "blue"
      ? "bg-gradient-to-b from-[#2c3e50] to-[#2980b9]"
      : color === "red"
      ? "bg-gradient-to-t from-[#240b36] to-[#c31432]"
      : color === "yellow"
      ? "bg-gradient-to-t from-[#799F0C] to-[#FFE000]"
      : color === "violet"
      ? "bg-gradient-to-t from-[#753a88] to-[#cc2b5e]"
      : color === "gray"
      ? "bg-gradient-to-t from-[#605C3C] to-[#3C3B3F]"
      : color === "black"
      ? "bg-gradient-to-t from-[#2C5364] via-[#203A43] to-[#0F2027]"
      : "bg-gray-200 text-black hover:bg-gray-300";

  const sizeStyle =
    size === "lg"
      ? "w-60 px-5 py-3 text-lg mb-10"
      : size === "md"
      ? "w-40 px-4 py-2 text-base"
      : "w-32 px-3 py-1 text-sm";

  return (
    <Link to={to} className={`${baseStyle} ${colorStyle} ${sizeStyle}`}>
      {children}
    </Link>
  );
};

export default Button;
