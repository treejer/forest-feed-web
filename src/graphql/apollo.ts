import {ApolloClient, ApolloLink, DefaultOptions, HttpLink, InMemoryCache} from '@apollo/client';
import {NetworkConfig} from '@forest-feed/config';

export function createApolloClient(config: NetworkConfig) {
  const forest = config.thegraphUrl;
  const lens = config.lensApiUrl;
  const forestGraphqlLink = new HttpLink({uri: forest});
  const lensGraphqlLink = new HttpLink({uri: lens});

  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  return new ApolloClient({
    link: ApolloLink.split(
      operation => {
        return operation.getContext().clientName === 'lens';
      },
      lensGraphqlLink,
      forestGraphqlLink,
    ),
    connectToDevTools: true,
    cache: new InMemoryCache(),
    defaultOptions,
  });
}
