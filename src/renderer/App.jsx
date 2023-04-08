import React from "react";
//
import { ipcRenderer } from "electron";





// window.webContents.send('custom-endpoint', 'hello from main process');

// export default function App() {
//   return <h1>Hello from React</h1>;
// }

// ipcRenderer.on('custom-endpoint', (event, msg) => {
//   console.log(msg); // prints "hello from main process"
// });
//
// import icon from '../../assets/icon.svg';

import { useEffect, useRef, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import PdfViewer from './PdfViewer';
import AudioPlayerComponent from './AudioPlayer';
import { Editor } from './Editor';
// import PdfViewer from './PdfViewer';

// PDFViewer
// https://stackoverflow.com/questions/65955980/react-pdf-js-warning-setting-up-fake-worker
// import { Worker, Viewer } from '@react-pdf-viewer/core';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
// import '@react-pdf-viewer/core/lib/styles/index.css';


// import './App.css';


export default function App() {
  const videoPlayerRef = useRef(null);
  const [activePreviewer, setActivePreviewer] = useState('');
  const [filepath, setFilepath] = useState('');
  const [text, setText] = useState(null);

  const editor = useRef();
  // useEffect(() => {
  //   // updating the conditional render to display the previewer needs to happen before loading a video so the video player can initialize
  //   // videoPlayerRef.current.resetPlayer();
  //   console.log('useEffect 1')
  //   if (activePreviewer == 'video') {
  //     console.log('activePlayer == video, loading', filepath)
  //     videoPlayerRef.current.loadPlayer(filepath);
  //   }
  // }, [activePreviewer]);
  ipcRenderer.on(
      'custom-endpoint',
      (event, data) => {
          console.log('main->renderer: ', data);
          setActivePreviewer(data.previewer);
          setFilepath(data.filepath);
      }
    );

  
  const hideIfInactive = (previewer) => {
    // returns the css display value based on the active previewer
    return activePreviewer === previewer ? 'block' : 'none';
  };

  const renderPreviewer = () => {
    console.log('render previewer');
    let filepathUrl = filepath && "file://" + filepath
    switch (activePreviewer) {
      case 'image':
        return <img src={filepathUrl}
        style={{
          objectFit: 'cover',
          height: '100%',
          width: '100%'
        }}
        />
      case 'video':
        return <VideoPlayer url={filepathUrl} />;
      case 'audio':
        return <AudioPlayerComponent url={filepathUrl} />;
      case 'text':
        return <Editor filepath={filepath} />
      case 'pdf':
        return (<PdfViewer url={filepathUrl}></PdfViewer>)
        // return (
        // <Worker workerUrl="/pdf.min.js">
        // <Viewer fileUrl={filepathUrl}/>
        // </Worker>
        // )
      default:
    }
  };

  return (renderPreviewer());
}
