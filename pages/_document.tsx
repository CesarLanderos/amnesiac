import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script async src="https://sdk.scdn.co/spotify-player.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onSpotifyWebPlaybackSDKReady = () => {
                const token =
                  'BQCnzkULBm5Tgjqkfla9IDp-C5CkaR-xLC6EwCWz0v1IwBIQDss8qkNCus0mg8x5eRar93F__yqSj6B3t3gozXKLjt7nXeoKo2wDkeR-EoGTdwxz_nPjojQdWklhDkZcbO4iorWiRyl5QboKNGFLySMeY97m7R08ARw62kqoAKjkqHrfY0Mp5zOR3dANBARkhe-F6BI';
                const player = new Spotify.Player({
                  name: 'Web Playback SDK Quick Start Player',
                  getOAuthToken: (cb) => {
                    console.log('herewego')
                    cb(token);
                  },
                  volume: 0.5,
                });

                // Ready
                player.addListener('ready', ({ device_id }) => {
                  console.log('Ready with Device ID', device_id);
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
                  console.error('account_error',message);
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
