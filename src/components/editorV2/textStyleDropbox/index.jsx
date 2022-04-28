import React, { useState } from 'react';
import Dropdown from '../../common/dropdown';

// const items = [
//   { label: 'h3', value: 'h3' },
//   { label: 'h2', value: 'h2' },
//   { label: 'h1', value: 'h1' },
// ];

const TextStyleDropbox = ({ handler = () => {} }) => {
  const [items, setItems] = useState([
    { label: 'h3', value: 'h3' },
    { label: 'h2', value: 'h2' },
    { label: 'h1', value: 'h1' },
  ]);

  function handleChange(selected) {
    handler(selected);
  }

  return <Dropdown title={'text style'} items={items} handler={handleChange} />
};

export default TextStyleDropbox;
