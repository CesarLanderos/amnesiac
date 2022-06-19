import React, { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';

const getAPI = (player?: Spotify.Player, deviceId?: string) => ({
  play: (uris: string[]) => {
    return new Promise((resolve) => {
      player?._options.getOAuthToken((access_token) => {
        fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ uris }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          }
        ).then(resolve);
      });
    });
  },
  playAlbumOrPlaylist: (context_uri: string) => {
    return new Promise((resolve) => {
      player?._options.getOAuthToken((access_token) => {
        fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ context_uri }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          }
        ).then(resolve);
      });
    });
  },
});

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
        'BQAfWyeaEP2hqmJAsRCyt48ecw6k6Iatg3XM-oXSXzOXL5tHZgsSvPoDTvjcIFhUVqTXk0qot0d1Zl2vK1L_J97b-qZuodUuvmOZp_a_WApiYo85Ykwo7mTc6qoxzY5jFTdMWht_G8OAOSZtb7ZMvk5Eqhbm-Ke1f6dD6D-eJ1vjstzGqAhvWf8LTQpu6r7pGhMTnZw';
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
          api: useMemo(() => getAPI(player, deviceId), [deviceId, player]),
        }}
      >
        {children}
      </SpotifyContext.Provider>
      <Script src="https://sdk.scdn.co/spotify-player.js" />
    </>
  );
};
