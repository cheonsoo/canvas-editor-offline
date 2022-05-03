import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import fabric from 'fabric';
import Editor from './components/editor';

function App() {
  return (
    <div className="App">
      <Editor />
    </div>
  );
}

export default App;
