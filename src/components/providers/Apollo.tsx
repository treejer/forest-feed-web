'use client';

import React, {useMemo} from 'react';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  ApolloProvider as OriginalApolloProvider,
  DefaultOptions,
} from '@apollo/client';

import {NetworkConfig} from '@forest-feed/config';
import {useAccessToken, useConfig} from '@forest-feed/redux/module/web3/web3.slice';

function createApolloClient(config: NetworkConfig, accessToken: string) {
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

export type ApolloProviderProps = React.PropsWithChildren;

export function ApolloProvider({children}: ApolloProviderProps) {
  const config = useConfig();
  const accessToken = useAccessToken();

  const client = useMemo(() => createApolloClient(config, accessToken), [accessToken, config]);

  return <OriginalApolloProvider client={client}>{children}</OriginalApolloProvider>;
}
