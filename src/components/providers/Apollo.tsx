'use client';

import React, {useMemo} from 'react';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  ApolloProvider as OriginalApolloProvider,
} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {RestLink} from 'apollo-link-rest';
import {camelCase} from 'tiny-case';

import {NetworkConfig} from '@forest-feed/config';
import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';

function createRestLink(config: NetworkConfig, accessToken: string) {
  const errorLink = onError(({graphQLErrors, response, networkError}) => {
    console.log(`[Network error]:`, networkError ? JSON.parse(JSON.stringify(networkError)) : response);
    // console.log(`[graphQLErrors error]:`, graphQLErrors);
    if (graphQLErrors) {
      // @ts-ignore
      response.errors = null;
    }
  });

  return errorLink.concat(
    new RestLink({
      uri: config.forestFeedApiUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      bodySerializers: {
        formData: (data: {[key: string]: any}, headers: Headers) => {
          const formData = new FormData();
          let hasFile = false;
          let canSetHeader = true;
          for (const key in data) {
            // eslint-disable-next-line no-prototype-builtins
            if (data.hasOwnProperty(key)) {
              const value = data[key];

              if (/file:\//.test(value)) {
                hasFile = true;
                formData.append(key, {
                  uri: value,
                  name: 'file.jpg',
                  type: 'image/jpg',
                } as any);
              }
              if (data.idCardFile.lastModified) {
                canSetHeader = false;
                formData.append(key, value);
              } else {
                formData.append(key, value);
              }
            }
          }
          if (canSetHeader) {
            headers.set('Content-Type', hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded');
          }

          return {body: formData, headers};
        },
      },
      fieldNameNormalizer: camelCase,
      // responseTransformer: async (data, typeName) => {
      //   console.log(await data.json(), '====> await data.json() <====');
      //   return {...data, message: data};
      // }
    }),
  );
}

function createApolloClient(config: NetworkConfig, accessToken: string) {
  const restLink = createRestLink(config, accessToken);

  const uri = config.thegraphUrl;
  const graphqlLink = new HttpLink({uri});

  return new ApolloClient({
    link: ApolloLink.from([restLink, graphqlLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            myCampaigns: {
              keyArgs: false,
              merge(existing = [], incoming) {
                return [...(existing || []), ...(incoming || [])];
              },
            },
          },
        },
      },
    }),
  });
}

export type ApolloProviderProps = React.PropsWithChildren;

export function ApolloProvider({children}: ApolloProviderProps) {
  const config = useConfig();

  const client = useMemo(() => createApolloClient(config, 'accessToken'), [config]);

  return <OriginalApolloProvider client={client}>{children}</OriginalApolloProvider>;
}
