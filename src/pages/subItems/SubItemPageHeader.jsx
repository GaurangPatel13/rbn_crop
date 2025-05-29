// SubItemPageHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SubItemPageHeader = ({ title, breadcrumb }) => {
  return (
    <div className="p-4">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

      {/* Breadcrumbs */}
      <div className="bg-gray-100 p-4 border-2 rounded-md text-sm text-gray-700 flex items-center space-x-2">
        {breadcrumb.map((item, index) => (
          <span key={index} className="flex items-center">
            {item.path ? (
              <Link to={item.path} className="text-blue-600 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600">{item.label}</span>
            )}
            {index < breadcrumb.length - 1 && <span className="mx-2">/</span>}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SubItemPageHeader;
