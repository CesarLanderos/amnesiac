import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo';
import SpotifySDK from '../lib/spotifySDK';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SpotifySDK />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
