import ReactPlayer from 'react-player';
import { forwardRef, useState, useImperativeHandle, useEffect } from 'react';

const VideoPlayer = ({url}) => {
  const [state, setState] = useState({
    pip: false,
    playing: true,
    controls: true,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  });

    // const loadPlayer = (url) => {
          // }

    // const resetPlayer = () => {
    //   setState({
    //     ...state,
    //     playing: false,
    //   });
    // },

  useEffect(() => {
    // console.log(state);
    setState({
            ...state,
            played: 0,
            loaded: 0,
            controls: true,
            pip: false,
          });
  }, [url]);
  console.log('rendering')

  return (
    <ReactPlayer
      url={url}
      playing={state.playing}
      controls={state.controls}
      width="100%"
      height="100%"
    />
  );
};

export default VideoPlayer;
