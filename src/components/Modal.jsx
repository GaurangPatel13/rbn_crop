import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-5xl max-h-[90vh] overflow-y-auto relative transition-all duration-300">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
          onClick={onClose}
          aria-label="Close Modal"
        >
          &times;
        </button>
        <div className="p-6">
          {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
