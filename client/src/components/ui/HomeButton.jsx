// src/components/ui/Button.jsx
import React from "react";
import { Link } from "react-router-dom";

const Button = ({ to, children, color = "green", size = "lg" }) => {
  const baseStyle =
    "inline-block rounded-2xl font-semibold focus:outline-none transition duration-200 text-center";

  const colorStyle =
    color === "green"
      ? "bg-green-700 text-white hover:bg-green-800"
      : color === "blue"
      ? "bg-blue-700 text-white hover:bg-blue-800"
      : color === "red"
      ? "bg-red-600 text-white hover:bg-red-700"
      : color === "yellow"
      ? "bg-yellow-400 text-black hover:bg-yellow-500"
      : color === "violet"
      ? "bg-violet-600 text-white hover:bg-violet-700"
      : color === "gray"
      ? "bg-gray-400 text-black hover:bg-gray-500"
      : color === "black"
      ? "bg-black text-white hover:bg-gray-900"
      : "bg-gray-200 text-black hover:bg-gray-300";

  const sizeStyle =
    size === "lg"
      ? "px-20 py-10 text-lg mb-10"
      : size === "md"
      ? "px-4 py-2 text-base"
      : "px-3 py-1 text-sm";

  return (
    <Link to={to} className={`${baseStyle} ${colorStyle} ${sizeStyle}`}>
      {children}
    </Link>
  );
};

export default Button;
