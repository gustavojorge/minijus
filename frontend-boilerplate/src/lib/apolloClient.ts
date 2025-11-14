import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import { useRef } from "react";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

type PageProps = {
  props: {
    [key: string]: unknown;
  };
  __APOLLO_STATE__?: NormalizedCacheObject;
};

let apolloClient: ApolloClient<NormalizedCacheObject>;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// Use backend-graphql service name when running in Docker (SSR), 
// or localhost when running in browser (client-side)
const getGraphQLUri = () => {
  if (typeof window === "undefined") {
    // Server-side: use Docker service name
    return process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://backend-graphql:4000/graphql";
  }
  // Client-side: use localhost (from browser perspective)
  return process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql";
};

const httpLink = new HttpLink({
  uri: getGraphQLUri(),
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  initialState: NormalizedCacheObject | null = null,
) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();

    const data = merge(existingCache, initialState, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s)),
        ),
      ],
    });

    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: PageProps,
) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }
  return pageProps;
}

export function useApollo(pageProps: PageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const storeRef = useRef<ApolloClient<NormalizedCacheObject>>();
  if (!storeRef.current) {
    storeRef.current = initializeApollo(state as NormalizedCacheObject);
  }
  return storeRef.current;
}
