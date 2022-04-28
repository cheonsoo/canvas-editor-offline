import React, { useState } from 'react';
import Selectbox from '../../common/selectbox';

const TextStyleSelectbox = ({ handler = () => {} }) => {
  const [items, setItems] = useState([
    { label: '12px', value: 12 },
    { label: '14px', value: 14 },
    { label: '18px', value: 18 },
    { label: '24px', value: 24 },
    { label: '36px', value: 36 },
    { label: '48px', value: 48 },
    { label: '96px', value: 96 }
  ]);

  function handleChange(evt) {
    const selected = evt.currentTarget.value;
    handler(selected);
  }

  return (<Selectbox items={items} handler={handleChange} />);
};

export default TextStyleSelectbox;