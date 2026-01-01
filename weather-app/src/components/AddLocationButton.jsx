import React from 'react';

const AddLocationButton = ({ onClick }) => {
  return (
    <button 
      className="floating-add-btn"
      onClick={onClick}
      title="جستجوی موقعیت جدید"
      style={{
        top: '30px',
        right: '30px',
      }}
    >
      +
    </button>
  );
};

export default AddLocationButton;

