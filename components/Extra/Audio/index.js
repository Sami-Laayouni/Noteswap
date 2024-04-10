import React, { useRef, forwardRef, useImperativeHandle } from "react";

const FlexibleAudioPlayer = forwardRef(({ src }, ref) => {
  const audioRef = useRef(null);

  useImperativeHandle(ref, () => ({
    playAudio: () => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    },
  }));

  return <audio ref={audioRef} src={src} preload="auto" controls />;
});
FlexibleAudioPlayer.displayName = "FlexibleAudioPlayer";

export default FlexibleAudioPlayer;
