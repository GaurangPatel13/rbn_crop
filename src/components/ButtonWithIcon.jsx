import React from 'react';

const ButtonWithIcon = ({ title, icon, bgcolor, className = "", onClick, btnclass = "", disabled = false }) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`flex items-center gap-2 p-2 rounded-md justify-center border 
        ${bgcolor ? bgcolor : "bg-bg-color"} 
        ${className} 
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <button className={`${btnclass} text-white`} disabled={disabled}>
        {title}
      </button>
      {icon && <div className='p-1 text-white'>{icon}</div>}
    </div>
  );
};

export default ButtonWithIcon;
