import React, { useRef } from 'react';
import styled from 'styled-components';

const SFileInput = styled.button`
  min-width: 25px;
  height: 25px;
  background-color: #fff;
  border: 1px solid gray;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  .upload-hidden {
    display: none;
  }
`;

// const FileInput = ({ handler = () => {} }) => {
const FileInput = (props) => {
  const fileInput = useRef(null);

  function handleClick(evt) {
    fileInput.current.click();
  }

  function handleChange(evt) {
    // const toBeUploaded = document.querySelector('#file-upload').files[0];
    const toBeUploaded = fileInput.current.files[0];
    console.log('toBeUploaded', toBeUploaded);
    props.handler && props.handler(toBeUploaded);
  }

  return (<SFileInput onClick={handleClick} onChange={handleChange}>
    {props.children}
    <input type="file" ref={fileInput} id="file-upload" className="upload-hidden" />
  </SFileInput>);
};

export default FileInput;