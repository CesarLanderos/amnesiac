import { ApolloClient, InMemoryCache } from '@apollo/client';
import introspectionQueryResultData from '../graphql/__generated__/fragmentTypes.json';

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache({
    possibleTypes: introspectionQueryResultData.possibleTypes,
  }),
});

export default client;
