import React from 'react';
import spinner from './Spinner.svg';
import './Spinner.css';

export default function Spinner(props:any) {
  return (
    <img
      className="Spinner"
      src={spinner}
      alt="waiting..."
      {...props}
    />
  );
}