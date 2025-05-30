import React from 'react';

const ButtonWithIcon = ({
  title,
  icon,
  bgcolor,
  className = "",
  onClick,
  btnclass = "",
  disabled = false,
  type = "button"  // default type
}) => {
  return (
    <button
      type={type}  // important for submit buttons
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`flex items-center gap-2 p-2 rounded-md justify-center border 
        ${bgcolor ? bgcolor : "bg-bg-color"} 
        ${className} 
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
        ${btnclass}
       text-white`}
    >
      {title}
      {icon && <div className='p-1 text-white'>{icon}</div>}
    </button>
  );
};

export default ButtonWithIcon;
