import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeSharp } from "react-icons/io5";

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  error,
  disable = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => setShowPassword(!showPassword);

  const inputClasses = `mt-1 block w-full text-xs bg-bg-color1/50 border-gray-300 rounded shadow-sm border ${
    type === "file" ? "p-2" : "p-3"
  } outline-none ${
    type === "number"
      ? "appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      : ""
  } ${name === "panNo" ? "uppercase" : ""}`;

  return (
    <div className="relative w-full">
      <label className="block text-sm font-normal text-gray-700">{label}</label>

      {type === "textarea" ? (
        <>
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || label}
            maxLength={maxLength}
            disabled={disable}
            className={`${inputClasses} resize-none h-18`}
          />
          {maxLength && (
            <p className="text-xs text-gray-500 text-right mt-1">
              {value.length}/{maxLength} characters
            </p>
          )}
        </>
      ) : (
        <>
          <input
            disabled={disable}
            placeholder={placeholder || label}
            type={type === "password" && showPassword ? "text" : type}
            name={name}
            value={type === "file" ? undefined : value}
            onChange={onChange}
            maxLength={maxLength}
            className={inputClasses}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={handleToggle}
              className="absolute right-2 top-[68%] transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <IoEyeSharp /> : <IoEyeOffOutline />}
            </button>
          )}
        </>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
