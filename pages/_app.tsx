import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import { Layout } from '../components/layout';
import { SpotifyProvider } from '../context/SpotifyContext';
import client from '../lib/apollo';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SpotifyProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Component {...pageProps} />
      </SpotifyProvider>
    </ApolloProvider>
  );
}

export default MyApp;
