import { Html, Head, Main, NextScript } from "next/document";

export default Document;

function Document() {
  const googleApiKey = process.env.GOOGLE_API;
  return (
    <Html lang="en">
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`}
          async
          defer
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
