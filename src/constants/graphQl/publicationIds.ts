import {gql} from '@apollo/client';

export const publicationIds = gql`
  query ($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        __typename
        ... on Post {
          id
          createdAt
          metadata {
            content
          }
        }
      }
      pageInfo {
        prev
        next
      }
    }
  }
`;

export function publicationIdsVariables(profileId: string, limit: number) {
  return {
    request: {
      profileId,
      publicationTypes: ['POST'],
      limit,
    },
  };
}
