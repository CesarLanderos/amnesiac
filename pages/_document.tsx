import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script async src="https://sdk.scdn.co/spotify-player.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onSpotifyWebPlaybackSDKReady = () => {
                const token =
                  'BQBILGa_r9eFDQJQrS4lb7RKOfRmboofbBVhkN2PMjEEcPwKaESVUtawssUd_R9fj9V_kWkOyCthYrMZHWol3Q0U6ZWd0LKAbzWCXyRxfxYH_whF8Wt_fs1UGun5q92HSoZMTOuXqGvASFF9nYeLHFY1Wo6GjZW9Pw76LmicD2bFcxZRKxlbSqTNFzVl4a_fozoAeWo';
                const player = new Spotify.Player({
                  name: 'Web Playback SDK Quick Start Player',
                  getOAuthToken: (cb) => {
                    cb(token);
                  },
                  volume: 0.5,
                });

                console.log('heeeer');

                // Ready
                player.addListener('ready', ({ device_id }) => {
                  console.log('Ready with Device ID', device_id);
                });

                // Not Ready
                player.addListener('not_ready', ({ device_id }) => {
                  console.log('Device ID has gone offline', device_id);
                });

                player.addListener('initialization_error', ({ message }) => {
                  console.error(message);
                });

                player.addListener('authentication_error', ({ message }) => {
                  console.error(message);
                });

                player.addListener('account_error', ({ message }) => {
                  console.error(message);
                });

                player.connect();
              };
            `,
          }}
        />
      </body>
    </Html>
  );
}
