import React, {useState} from 'react';
import ReactPlayer from 'react-player/lazy';

const VideoComponent = () => {

    const [playIndex, setPlayIndex] = useState<number>(0);
    const playList = [
        { index: 0, url: `${process.env.PUBLIC_URL}/video/testVideo.mp4`},
        { index: 1, url: `${process.env.PUBLIC_URL}/video/4kTestVideo.mp4`},
        { index: 2, url: `${process.env.PUBLIC_URL}/video/grassVideo.mp4`}
    ]

    const handleVideo = () => {
        playIndex === playList.length - 1 ? setPlayIndex(0) : setPlayIndex(playIndex + 1);
    }

    return (
      <>
          <h2>Player Test</h2>
          <div>
              <ReactPlayer
                url={playList[playIndex].url}    // 플레이어 url
                width='800px'         // 플레이어 크기 (가로)
                height='500px'        // 플레이어 크기 (세로)
                playing={true}        // 자동 재생 on
                muted={true}          // 자동 재생 on
                controls={true}       // 플레이어 컨트롤 노출 여부
                pip={true}            // pip 모드 설정 여부
                onEnded={handleVideo}  // 플레이어 끝났을 때 이벤트
              />
          </div>
      </>
    );
}

export default VideoComponent;