import ApolloClient, { createNetworkInterface } from 'apollo-client';

const networkInterface = createNetworkInterface('/graphql');

export const WordExpressClient = new ApolloClient({
  networkInterface,
});
