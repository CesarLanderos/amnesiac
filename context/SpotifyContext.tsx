import React, { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';

const spotifyAPIRequest =
  (player: Spotify.Player) =>
  (url: string, method: string, body: Record<string, unknown>) => {
    return new Promise(() => {
      return player._options.getOAuthToken((token) => {
        fetch(url, {
          method,
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      });
    });
  };

const getAPI = (player: Spotify.Player, deviceId: string) => {
  const request = spotifyAPIRequest(player);

  return {
    play: (uris: string[]) => {
      return request(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        'PUT',
        { uris }
      );
    },
    playAlbumOrPlaylist: (contextURI: string) => {
      return request(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        'PUT',
        { context_uri: contextURI }
      );
    },
  };
};

export const SpotifyContext = React.createContext<{
  player?: Spotify.Player;
  state?: Spotify.PlaybackState;
  api?: ReturnType<typeof getAPI>;
}>({});

type Props = {
  children?: React.ReactNode;
};

export const SpotifyProvider = ({ children }: Props) => {
  const [player, setPlayer] = useState<Spotify.Player>();
  const [deviceId, setDeviceId] = useState<string>();
  const [state, setState] = useState<Spotify.PlaybackState>();

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token =
        'BQDlEe8JBKC8vfPwfrobDbb8MosOYUHB7KPgQfYqahXT6l4TXJGjyy2z9f29o_AxYKTPqt-wOXtFtj5qmdhyquS0wjeKUdvXmni4tgALnE7dRaOkqTPa7nj1LsJ_kKji92OnMPkugyCjW33Pe9n7FExJoNuHJlg7RFO6iNoHamWcNoeOFO1VH1YlEeTQisXRztSD958';
      const player = new Spotify.Player({
        name: 'Amnesiac',
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.3,
      });

      // Ready
      player.addListener('ready', async ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setPlayer(player);
        setDeviceId(device_id);
      });

      player.addListener('player_state_changed', (state) => {
        console.log('cambio');

        setState(state);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('initialization_error', ({ message }) => {
        console.error('initialization_error', message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('authentication_error', message);
      });

      player.addListener('account_error', ({ message }) => {
        console.error('account_error', message);
      });

      player.connect();
    };
  }, []);
  // TODO: this is rendering twice
  console.log('rendering');

  return (
    <>
      <SpotifyContext.Provider
        value={{
          player,
          state,
          api: useMemo(() => {
            if (!player || !deviceId) return;
            return getAPI(player, deviceId);
          }, [deviceId, player]),
        }}
      >
        {children}
      </SpotifyContext.Provider>
      <Script src="https://sdk.scdn.co/spotify-player.js" />
    </>
  );
};
