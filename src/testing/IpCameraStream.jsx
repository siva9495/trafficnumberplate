// IpCameraStream.js

import React from 'react';
import { requireNativeComponent } from 'react-native';
import PropTypes from 'prop-types';

const NativeRTSPVideoPlayer = requireNativeComponent('RCTVLCPlayer');

const RTSPVideoPlayer = ({ rtspUrl }) => {
  return <NativeRTSPVideoPlayer style={{ flex: 1 }} src={rtspUrl} />;
};

RTSPVideoPlayer.propTypes = {
  rtspUrl: PropTypes.string.isRequired,
};

export default RTSPVideoPlayer;
