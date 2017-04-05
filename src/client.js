import ApolloClient, { createNetworkInterface } from 'apollo-client'

const networkInterface = createNetworkInterface({uri: '/graphql'})

export const WordExpressClient = new ApolloClient({
  networkInterface,
})
