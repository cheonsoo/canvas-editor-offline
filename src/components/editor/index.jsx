import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { GithubPicker } from 'react-color';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PanoramaIcon from '@mui/icons-material/Panorama';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CreateIcon from '@mui/icons-material/Create';
import FlipToFrontIcon from '@mui/icons-material/FlipToFront';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';

import TextStyleDropdown from './textStyleDropbox';
import TextStyleSelectbox from './textStyleSelectbox';
import TextSizeSelectbox from './textSizeSelectbox';
import FileInput from '../common/fileInput';
import ObjectLayers from './objectLayers';

const SEditorContainer = styled.div`
  width: 100%;
  height: 100%;

  .videoContainer {
    width: 100%;

    #output {
      width: 100%;
      overflow: auto;

      #output-list {
        list-style: none;
        display: flex;
        flex-direction: row;
        padding-feft: 20px;

      }
    }
  }

  .canvasContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .controller {
      width: 100%;
      min-height: 35px;
      margin-bottom: 10px;

      > div {
        // border: 1px solid gray;
        height: 100%;
        margin: 0 20px;

        ul {
          list-style: none;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          padding: 0;
          margin: 0;

          li {
            margin: 0 10px 10px 0;
          }
        }
      }
    }

    canvas {
      border: 1px solid gray;
    }
  }

  .btnsContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;

    .github-picker {
      position: fixed !important;
    }
  }
`;

const SObjectLayersContainer = styled.div`
  padding-left: 20px;
  overflow: auto;

  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    // flex-wrap: wrap;
    padding: 0;

    li {
      margin: 0 10px 10px 0;
    }
  }
`;

const SCaptureBtn = styled.button`
  width: 20px;
  height: 20px;
  border: 3px solid gray;
  border-radius: 8px;
  background-color: transparent;
  color: #fff;
  font-weight: 900;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const SButton = styled.button`
  width: 100px;
  height: 35px;
  border: 1px solid gray;
  border-radius: 8px;
  background-color: #e9e9e9;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SColorPicker = styled.div`
  width: 30px;
  height: 15px;
  padding: 4px;
  margin: 0;
  border: 1px solid gray;
  border-radius: 3px;

  div {
    background-color: ${props => props.color || '#000'};
    width: 100%;
    height: 100%;
    border-radius: 3px;
  }
`;

const SControlButton = styled.button`
  min-width: 25px;
  height: 25px;
  background-color: #fff;
  border: 1px solid gray;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${prop => prop.enabled ? 'rgb(26, 32, 39)' : '#fff'};
  color: ${prop => prop.enabled ? '#fff' : '#000'};
`;

const SAddTextControlButton = styled.div`
  .btn-div {}
  .input-div {
    display: ${props => props.show ? 'block' : 'none'};
    position: absolute;
    padding-top: 3px;
    z-index: 10;

    input {
      height: 28px;
      width: 150px;
      border-radius: 4px;
      border: 1px solid gray;
      padding-left: 5px;
    }
  }
`;

const SColorPickerControlButton = styled.div`
  .btn-div {}
  .input-div {
    display: ${props => props.showColorPicker ? 'block' : 'none'};
    position: absolute;
    padding-top: 8px;
    z-index: 10;
  }
`;

const Editor = () => {
  const [texts, setTexts] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [canvasF, setCanvasF] = useState(null);
  const [width, setWidth] = useState(null);
  const [color, setColor] = useState('#004dcf');
  const [selectedObject, setSelectedObject] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textStyle, setTextStyle] = useState(30);
  const [showTextInput, setShowTextInput] = useState(false);
  const [objects, setObjects] = useState([]);
  const [layers, setLayers] = useState([]);
  const [textOptions, setTextOptions] = useState({
    linethrough: false,
    fontStyle: 'normal',
    fontSize: 24,
    underline: false,
    fontWeight: 300,
    stroke: false,
    fill: '#004dcf'
  });

  const canvasNode = useRef(null);
  const videoNode = useRef(null);
  const textInput = useRef(null);
  const fileInput = useRef(null);

  let canvasFabric = null;
  let ctx = null;

  useEffect(() => {
    document.body.addEventListener('keyup', function(evt) {
      if (evt.keyCode === 27 && canvasF) {
        canvasF.discardActiveObject();
        canvasF.renderAll();
        setSelectedObject(null);
      }

      if (evt.keyCode === 8 && canvasF) {
        canvasF.remove(canvasF.getActiveObject());
        setSelectedObject(null);
      }
    });
  }, [canvasF]);

  useEffect(() => {
    if (!canvasFabric) {
      canvasFabric = new fabric.Canvas(canvasNode.current, {
        width: document.body.clientWidth - 40,
        height: 300
      });
      ctx = canvasFabric.getContext('2d');
      canvasFabric.on('selection:cleared', () => {
        setSelectedObject(null);
      });

      canvasFabric.on('after:render', () => {
        const _layers = canvasFabric.getObjects().map(o => o.toDataURL());
        const _objects = canvasFabric.getObjects();
        setLayers(_layers);
        setObjects(_objects);
      });

      setCanvasF(canvasFabric);
    }
  }, [canvasFabric]);

  useEffect(() => {
    if (selectedObject) {
      selectedObject.set({ ...textOptions, fill: color });
      canvasF.renderAll();
    }
  }, [textOptions]);

  function addObject(obj) {
    obj.on('selected', () => {
      setSelectedObject(obj);
    });
    obj.id = new Date().getTime();
    canvasF.add(obj);
  }

  function handleShowTextInput() {
    textInput.current.focus();
    setShowTextInput(!showTextInput);
  }

  function addText() {
    const txt = textInput.current.value;
    const textObject = new fabric.IText(txt, { ...textOptions, fill: color });
    addObject(textObject);
  }

  function setImage(evt) {
    const imgNode = evt.currentTarget;
    const w = videoNode.current.videoWidth * 0.25;
    const h = videoNode.current.videoHeight * 0.25;
    const img = new fabric.Image(imgNode, {
      left: 0,
      top: 0,
      width: w,
      height: h
    });
    img.scaleToWidth(canvasF.width);
    addObject(img);
  }

  function test() {
    addObject(new fabric.Circle({ radius: 20, fill: 'green', left: 100, top: 100 }));
    addObject(new fabric.Triangle({ width: 20, height: 30, fill: 'blue', left: 50, top: 50 }));
    addObject(new fabric.Text('Lotte-E-Commerce', { fontWeight: '900' }));
  }

  function shoot() {
    const scaleFactor = 0.25;
    if (scaleFactor == null) {
      scaleFactor = 1;
    }
    var w = videoNode.current.videoWidth * scaleFactor;
    var h = videoNode.current.videoHeight * scaleFactor;
    var _canvas = document.createElement('canvas');
    _canvas.width = w;
    _canvas.height = h;
    const _ctx = _canvas.getContext('2d');
    _ctx.drawImage(videoNode.current, 0, 0, w, h);
    const dataUrl = _canvas.toDataURL();

    setSnapshots(snapshots.concat(dataUrl));
  }

  function handleColorPicker(val) {
    setColor(val.hex);
    setShowColorPicker(!showColorPicker);
    if (selectedObject)
      selectedObject.set('fill', val.hex);
    canvasF.renderAll();
  }

  function download() {
    let dataURL = canvasF.toDataURL('image/png');

    dataURL = dataURL.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
    dataURL = dataURL.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
    // dataURL.replace(/^data:image\/(png|jpg);base64,/, "")

    var aTag = document.createElement('a');
    aTag.download = `${new Date().getTime()}.jpeg`;
    aTag.href = dataURL;
    aTag.click();
  }

  function upload(file) {
    const video = document.querySelector('#videoPlayer');

    let canPlay = video.canPlayType(file.type)
    if (canPlay === '') canPlay = 'no';
    if (canPlay === 'no') {
      alert(`can play type ${file.type} ${canPlay}`);
      return;
    }

    video.src = URL.createObjectURL(file);
    video.load();
  }

  function removeSelectedObject() {
    console.log(selectedObject);
    canvasF.remove(selectedObject);
    setSelectedObject(null);
  }

  function handleContainerEvent(evt) {
    console.log('handleConatinerEvent', evt);
  }

  function handleKeyUpTextInput(evt) {
    if (evt.keyCode === 13) {
      addText();
      evt.currentTarget.value = '';
      setShowTextInput(false);
    }
  }

  function handleDrag(sorted) {}

  function handleObjectPosition({ action = '' }) {
    if (!selectedObject) return;
    if (action === 'forward') // all the way up
      selectedObject.bringToFront();
    else if (action === 'back') // all the way down
      selectedObject.sendToBack();
    else if (action === 'forward') // 1 level up
      selectedObject.bringForward();
    else if (action === 'backward') // 1 level down
      selectedObject.sendBackwards();
  }

  return (<SEditorContainer>
    <div className='videoContainer' onKeyUp={handleContainerEvent}>
      <div>
        <video ref={videoNode} className='videoPlayer' id='videoPlayer' width='100%' controls crossOrigin='anonymous' src='https://s3.ap-northeast-2.amazonaws.com/test-pddetail-admin.lotteon.com/static/images/ForBiggerFun.mp4' />
        <SCaptureBtn onClick={shoot}>O</SCaptureBtn>
      </div>

      <div><h3>CAPTURES (클릭하여 편집기에 추가)</h3></div>
      <div id='output'>
        <ul id='output-list'>
          {snapshots.map((img, idx) => (
            <li key={idx}><img src={img} onClick={(evt) => setImage(evt)} /></li>
          ))}
        </ul>
      </div>
    </div>

    <div className='canvasContainer'>
      <div className='controller'>
        <div>
          <ul>
            <li><TextSizeSelectbox handler={(selected) => setTextOptions({ ...textOptions, fontSize: selected })} /></li>
            <li>
              <SAddTextControlButton show={showTextInput}>
                <div className='btn-div'>
                  <SControlButton onClick={handleShowTextInput}><CreateIcon /></SControlButton>
                </div>
                <div className='input-div'>
                  <input type='text' id='text-input' ref={textInput} onKeyUp={handleKeyUpTextInput} />
                </div>
              </SAddTextControlButton>
            </li>
            <li><SControlButton enabled={textOptions.fontWeight === 'bold' ? true : false} onClick={() => setTextOptions({ ...textOptions, fontWeight: textOptions.fontWeight === 'bold' ? 'normal' : 'bold' })}><FormatBoldIcon /></SControlButton></li>
            <li><SControlButton enabled={textOptions.fontStyle === 'italic' ? true : false} onClick={() => setTextOptions({ ...textOptions, fontStyle: textOptions.fontStyle === 'italic' ? 'normal' : 'italic' })}><FormatItalicIcon /></SControlButton></li>
            <li><SControlButton enabled={textOptions.linethrough} onClick={() => setTextOptions({ ...textOptions, linethrough: !textOptions.linethrough })}><FormatStrikethroughIcon /></SControlButton></li>
            <li>
              <SColorPickerControlButton showColorPicker={showColorPicker}>
                <div className='btn-div'>
                  <SColorPicker color={color} onClick={() => setShowColorPicker(!showColorPicker)}><div></div></SColorPicker>
                </div>
                <div className='input-div'>
                  <GithubPicker color onChangeComplete={handleColorPicker} />
                </div>
              </SColorPickerControlButton>
            </li>
            <li><SControlButton onClick={removeSelectedObject}><ClearIcon /></SControlButton></li>
            <li><FileInput handler={upload}><PanoramaIcon /></FileInput></li>
            <li><SControlButton onClick={download}><DownloadIcon /></SControlButton></li>
            <li><SControlButton onClick={() => handleObjectPosition({ action: 'front' })}><FlipToFrontIcon /></SControlButton></li>
            <li><SControlButton onClick={() => handleObjectPosition({ action: 'back' })}><FlipToBackIcon /></SControlButton></li>
            <li><SControlButton onClick={test}><QuestionMarkIcon /></SControlButton></li>
          </ul>
        </div>
      </div>
      <canvas id='canvas-editor' ref={canvasNode} />
    </div>

    <br />
    <div className='object-layers' style={{ display: 'none' }}>
      <div><h3>Layers (드래그하여 오브젝트 노출순위 조정)</h3></div>
      <SObjectLayersContainer>
        <ul>
          {layers.map((l, idx) => (
            <li key={idx}><img src={l} /></li>
          ))}
        </ul>
      </SObjectLayersContainer>
    </div>

    <div className='object-layers' style={{ display: 'none' }}>
      <div><h3>Layers (드래그하여 오브젝트 노출순위 조정, 작업중)</h3></div>
      <ObjectLayers data={objects} handler={handleDrag} />
    </div>
  </SEditorContainer>);
}

export default Editor;
