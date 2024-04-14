import React, { useRef, forwardRef, useImperativeHandle } from "react";

const FlexibleAudioPlayer = forwardRef(({ src }, ref) => {
  const audioRef = useRef(null);

  useImperativeHandle(ref, () => ({
    playAudio: () => {
      if (audioRef.current) {
        return audioRef.current.play().catch((error) => {
          console.error("Error during audio playback:", error);
        });
      }
    },
  }));

  return <audio ref={audioRef} src={src} preload="auto" controls />;
});
FlexibleAudioPlayer.displayName = "FlexibleAudioPlayer";

export default FlexibleAudioPlayer;
