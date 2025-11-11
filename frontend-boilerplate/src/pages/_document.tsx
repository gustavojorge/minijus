import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link rel="icon" href="/jus_icon.png" type="image/png" />
        <link rel="shortcut icon" href="/jus_icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/jus_icon.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
