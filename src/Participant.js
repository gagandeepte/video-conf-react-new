import React, { useState, useEffect, useRef } from "react";
import Controls from "./Controls";

const Participant = ({
    participant,
    handleCallDisconnect,
    handleAudioToggle,
    handleVideoToggle,
    toggleAudio,
    toggleVideo,
    isLocal
  }) => {

  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    console.log('Part Use Effect Called');
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      console.log('Tracks Sub');
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      console.log('tracks Unsub');
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);


  useEffect(() => {
    console.log('Video Tracks attached called ',videoTracks);
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    console.log('Audio Tracks attached called ',audioTracks);
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant" style={{ position: "relative" }}>
      <h3>{participant.identity}</h3>
      <video id="localVideo" ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true}  />
      {isLocal && (
        <Controls
          handleCallDisconnect={handleCallDisconnect}
          handleAudioToggle={handleAudioToggle}
          handleVideoToggle={handleVideoToggle}
          audio={toggleAudio}
          video={toggleVideo}
        />
      )}
    </div>
  );
};

export default Participant;
