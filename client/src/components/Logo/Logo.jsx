import { Box } from '@mui/material';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Logo = ({ wid }) => {
  return (
    <img
      src="/logo.jpeg"
      alt="Boarding House System Logo"
      width={wid ? wid : 90}
    />
  );
};

export default Logo;
