import { Html, Head, Main, NextScript } from "next/document";

export default Document;

function Document() {
  const googleApiKey = process.env.GOOGLE_API;
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5/tinymce.min.css"
        />
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
