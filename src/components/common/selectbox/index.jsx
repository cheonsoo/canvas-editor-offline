import React from 'react';
import styled from 'styled-components';

const SSelectbox = styled.select`
  min-width: 50px;
  height: 25px;
  padding-left: 5px;
`;

const Selectbox = ({ items = [], handler = () => {} }) => {
  return <SSelectbox onChange={handler}>
    <option value=''></option>
    {items.map((item, idx) => (
      <option key={idx} value={item.value}>{item.value}</option>
    ))}
  </SSelectbox>
};

export default Selectbox;