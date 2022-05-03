import React, { useState } from 'react';
import Selectbox from '../../common/selectbox';

const TextStyleSelectbox = ({ handler = () => {} }) => {
  const [items, setItems] = useState([
    { label: 'Template1', value: 'template1' },
    { label: 'Template2', value: 'template2' },
    { label: 'Template3', value: 'template3' },
    { label: 'Template4', value: 'template4' },
    { label: 'Template5', value: 'template5' },
  ]);

  function handleChange(evt) {
    const selected = evt.currentTarget.value;
    handler(selected);
  }

  return (<Selectbox items={items} handler={handleChange} />);
};

export default TextStyleSelectbox;