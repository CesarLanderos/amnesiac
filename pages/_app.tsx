import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import client from '../lib/apollo';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [player, setPlayer] = useState<Spotify.Player>();
  const [deviceId, setDeviceId] = useState<string>();

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token =
        'BQALFRcAamYH6IsCDzJ4Z1upseDx04SoOOoBB6fIa4RwQC3HEMU8loTA4cQvSOU6rP-6VyFAWeLwPs-HY3k6YKSn0bkklrf5M7kgC7YUH1AwVMhVe1OqTl-kC5TKRdUsbA1PcKoWx4rUR4dbmjLLkIqAJ-1g2DDbFTx37dSt0-7QCcRZeU4H_KjRkSDh1BIxdcfo7ic';
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

  return (
    <ApolloProvider client={client}>
      <button
        onClick={async () => {
          player?._options.getOAuthToken((access_token) => {
            fetch(
              `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
              {
                method: 'PUT',
                body: JSON.stringify({
                  uris: ['spotify:track:7xGfFoTpQ2E7fRF5lN10tr'],
                }),
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${access_token}`,
                },
              }
            );
          });

          console.log(await player?.getCurrentState());
        }}
      >
        test button
      </button>
      <Component {...pageProps} />
      <Script src="https://sdk.scdn.co/spotify-player.js" />
    </ApolloProvider>
  );
}

export default MyApp;
