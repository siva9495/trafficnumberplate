// App.js

import React from 'react';
import ReactPlayer from 'react-player';

const WebStream = () => {
    const hlsStreamUrl = 'http://localhost:4000/stream';

    return (
        <div>
            <h1>RTSP Stream via HLS</h1>
            <ReactPlayer
                url={hlsStreamUrl}
                width='100%'
                height='auto'
                controls={true}
                playing={true}
            />
        </div>
    );
};

export default WebStream;
