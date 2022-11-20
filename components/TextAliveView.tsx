import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PlayerSeekbar } from 'textalive-react-api';
import { useTextAlivePlayer } from './useTextAlivePlayer';
import { Button } from "semantic-ui-react";

// https://github.com/TextAliveJp/textalive-app-params
const songUrl = "http://piapro.jp/t/C0lr/20180328201242";

export const TextAliveView = () => {
  const [status, setStatus] = useState("stop");
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null);
  const div = useMemo(() => <div className='media' ref={setMediaElement} />, []);
  const { player, app, char } = useTextAlivePlayer(songUrl, mediaElement);
  const disabled = useMemo(() => app?.managed ?? false, [app])

  // @ts-ignore
  useEffect(() => {
    if (!player) { return }
    const listener = {
      onPlay: () => setStatus("play"),
      onPause: () => setStatus("pause"),
      onStop: () => setStatus("stop"),
    };
    player.addListener(listener);
    return () => player.removeListener(listener);
  }, [player]);

  const handlePlay = useCallback(() => player && player.requestPlay(), [
    player,
  ]);
  const handlePause = useCallback(() => player && player.requestPause(), [
    player,
  ]);
  const handleStop = useCallback(() => player && player.requestStop(), [
    player,
  ]);

  // @ts-ignore
  return (
    <div>
      <h1>TextAlive Sample</h1>
      {!disabled && player && (
        <>
          <Button
            content={status !== "play" ? "再生" : "一時停止"}
            onClick={status !== "play" ? handlePlay : handlePause}
            size="small"
            disabled={disabled}
          />
          <Button
            content="停止"
            onClick={handleStop}
            size="small"
            disabled={disabled || status === "stop"}
          />
          {/*
          // @ts-ignore */}
          <PlayerSeekbar player={player} />
        </>
      )}
      {div}
      <div
        className="char"
        style={{
          fontSize: 50,
        }}
      >
        {char}
      </div>
    </div>
  );
};