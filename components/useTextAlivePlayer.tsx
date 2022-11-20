import { useEffect, useState } from 'react';
import { IPlayer, IPlayerApp, Player } from 'textalive-app-api';

type TextAlivePlayer = {
  player: IPlayer | null;
  app: IPlayerApp | null;
  char: string;
}

export const useTextAlivePlayer = (songUrl: string, mediaElement: HTMLDivElement | null): TextAlivePlayer => {
  const [app, setApp] = useState<IPlayerApp | null>(null);
  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [char, setChar] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !mediaElement) {
      return;
    }

    if (!process.env.NEXT_PUBLIC_TEXT_ALIVE_TOKEN) {
      console.error(`text alive token is not given: ${process.env.NEXT_PUBLIC_TEXT_ALIVE_TOKEN}`)
      return
    }

    const p = new Player({
      app: {
        // トークンは https://developer.textalive.jp/profile で取得したものを使う
        token: process.env.NEXT_PUBLIC_TEXT_ALIVE_TOKEN,
        parameters: [],
      },
      mediaElement,
    });

    const playerListener = {
      onAppReady: (app: IPlayerApp) => {
        console.log('--- [app] initialized as TextAlive app ---');
        console.log('managed:', app.managed);
        console.log('host:', app.host);
        console.log('song url:', app.songUrl);
        if (!app.songUrl) {
          p.createFromSongUrl(songUrl);
        }
        setApp(app);
      },
      onVideoReady: () => {
        console.log('--- [app] video is ready ---');
        console.log('player:', p);
        console.log('player.data.song:', p.data.song);
        console.log('player.data.song.name:', p.data.song.name);
        console.log('player.data.song.artist.name:', p.data.song.artist.name);
        console.log('player.data.songMap:', p.data.songMap);
        let c = p.video.firstChar;
        while (c && c.next) {
          c.animate = (now, u) => {
            if (u.startTime <= now && u.endTime > now) {
              setChar(u.text);
            }
          };
          c = c.next;
        }
      },
    };
    p.addListener(playerListener);

    setPlayer(p);
    return () => {
      console.log('--- [app] shutdown ---');
      p.removeListener(playerListener);
      p.dispose();
    };
  }, [songUrl, mediaElement, process.env.TEXT_ALIVE_TOKEN]);

  return {
    player,
    app,
    char,
  };
};