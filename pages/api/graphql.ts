import { createServer } from '@graphql-yoga/node';
import { createContext } from '../../graphql/context';
import { schema } from '../../graphql/schema';

const server = createServer({
  schema,
  context: createContext,
  endpoint: '/api/graphql',
  graphiql: false, // uncomment to disable GraphiQL
});

export default server;
