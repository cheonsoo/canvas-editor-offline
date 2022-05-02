import React, { useState, useEffect, forwardRef, useRef } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import PanoramaIcon from '@mui/icons-material/Panorama';
import { TransitionProps } from '@mui/material/transitions';
import FileInput from '../../common/fileInput';

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

const SVideoController = styled.div`
  width: 100%;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: right;
  margin: 10px 0 0 0;

  > div {
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

        img {
          width: 150px;
        }
      }
    }
  }
`;

const SVideoSnapshots = styled.div`
  width: 100%;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: left;
  margin: 10px 0 0 0;
  overflow: auto;

  > div {
    height: 100%;
    margin: 0 20px;

    ul {
      list-style: none;
      display: flex;
      flex-direction: row;
      // flex-wrap: wrap;
      padding: 0;
      margin: 0;
      overflow: auto;

      li {
        margin: 0 10px 10px 0;
      }
    }
  }
`;

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ show = false, handleShow = () => {}, handler = () => {} }) {
  const [videoSource, setVideoSource] = useState('');
  const [snapshots, setSnapshots] = useState([]);

  const videoNode = useRef(null);

  const handleClickOpen = () => {
    handleShow();
  };

  const handleClose = () => {
    handleShow();
  };

  function onLoadedData() {
    console.log("onLoadedData");

    const videoWidth = document.querySelector('#videoPlayer').videoWidth;
    const videoHeight = document.querySelector('#videoPlayer').videoHeight;
    const clientWidth = document.body.clientWidth;
    const canvasHeight = (videoHeight * clientWidth) / videoWidth;
    console.log('videoWidth: ', videoWidth);
    console.log('videoHeight: ', videoHeight);
    console.log('clientWidth: ', clientWidth);
    console.log('canvasHeight: ', canvasHeight);
    // canvas.current.setHeight(canvasHeight);
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

    // clearCanvas('image');

    // const imgNode = new Image();
    // imgNode.src = dataUrl;
    // const imgObject = new fabric.Image(imgNode, {
    //   left: 0,
    //   top: 0,
    //   width: w,
    //   height: h
    // });
    // imgObject.scaleToWidth(canvas.current.width);
    // addObject(imgObject);
    // imgObject.sendToBack();
  }

  function upload(file) {
    console.log('### upload');

    let canPlay = videoNode.current.canPlayType(file.type)
    if (canPlay === '')
      canPlay = 'no';
    if (canPlay === 'no') {
      alert(`can play type ${file.type} ${canPlay}`);
      return;
    }

    videoNode.current.src = URL.createObjectURL(file);
    videoNode.current.load();
  }

  function chooseSnapshot(img) {
    handler(img);
    handleShow();
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={show}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Video Capture
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Save
            </Button>
          </Toolbar>
        </AppBar>

        <div className='videoContainer'>
          <SVideoController>
            <div>
              <ul>
                <li><FileInput handler={upload}>File Upload</FileInput></li>
                <li><SControlButton onClick={shoot}>Screen Capture</SControlButton></li>
                {/* <li><SControlButton onClick={sendToParent}>SEND TO PARENT</SControlButton></li>
                <li><SControlButton onClick={() => {
                  canvas.current.discardActiveObject();
                  canvas.current.renderAll();
                }}>UNSELECT</SControlButton></li>
                <li><SControlButton onClick={removeSelectedObject}><ClearIcon /></SControlButton></li>
                <li><TemplateSelectbox handler={setTemplate} /></li>
                <li><SControlButton onClick={openVideoCaptureModal}>Video Capture</SControlButton></li> */}
              </ul>
            </div>
          </SVideoController>

          <div>
            <video ref={videoNode} className='videoPlayer' id='videoPlayer' width='100%' controls crossOrigin='anonymous' src={videoSource} onLoadedData={onLoadedData} />
            <SCaptureBtn onClick={shoot}>O</SCaptureBtn>
          </div>

          <SVideoSnapshots>
            <div>
              <ul>
                {snapshots.map((img, idx) => (
                  <li key={idx}><img src={img} onClick={() => chooseSnapshot(img)} /></li>
                ))}
              </ul>
            </div>
          </SVideoSnapshots>

        </div>
      </Dialog>
    </div>
  );
}