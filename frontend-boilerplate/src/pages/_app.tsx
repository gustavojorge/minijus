import "@radix-ui/themes/styles.css";
import "@/styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { Theme } from "@radix-ui/themes";
import type { AppProps } from "next/app";

import { useApollo } from "@/lib/apolloClient";

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Theme accentColor="jade">
        <Component {...pageProps} />
      </Theme>
    </ApolloProvider>
  );
}
