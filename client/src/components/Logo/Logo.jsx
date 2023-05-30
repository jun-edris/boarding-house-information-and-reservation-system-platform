import React from 'react';

const Logo = ({ wid }) => {
  return (
    <img
      src="/logo.png"
      alt="Boarding House System Logo"
      width={wid ? wid : 90}
    />
  );
};

export default Logo;
