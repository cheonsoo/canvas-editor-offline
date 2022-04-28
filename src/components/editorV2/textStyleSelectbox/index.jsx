import React, { useState } from 'react';
import Selectbox from '../../common/selectbox';

const TextStyleSelectbox = ({ handler = () => {} }) => {
  const [items, setItems] = useState([
    { label: 'h3', value: 'h3' },
    { label: 'h2', value: 'h2' },
    { label: 'h1', value: 'h1' },
    { label: 'Headline', value: 'headline' }
  ]);

  function handleChange(evt) {
    const selected = evt.currentTarget.value;
    handler(selected);
  }

  return (<Selectbox items={items} handler={handleChange} />);
};

export default TextStyleSelectbox;