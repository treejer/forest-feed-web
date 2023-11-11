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
import {createApolloClient} from '@forest-feed/graphql/apollo';

export type ApolloProviderProps = React.PropsWithChildren;

export function ApolloProvider({children}: ApolloProviderProps) {
  const config = useConfig();

  const client = useMemo(() => createApolloClient(config), [config]);

  return <OriginalApolloProvider client={client}>{children}</OriginalApolloProvider>;
}
