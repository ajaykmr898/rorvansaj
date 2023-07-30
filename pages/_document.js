import { Html, Head, Main, NextScript } from "next/document";

export default Document;

function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          rel="stylesheet"
        />
        <script src="https://code.jquery.com/jquery-3.6.0.slim.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
