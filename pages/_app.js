import "../styles/globals.css";
import "../styles/fonts.css";
import "../styles/quill.css";

import Head from "next/head";
import DefaultLayout from "../layouts/DefaultLayout";
import { appWithTranslation } from "next-i18next";

/**
 * Custom App component for Next.js.
 *
 * @param {Object} props - The props for the App component.
 * @param {React.ComponentType} props.Component - The page component to render.
 * @param {Object} props.pageProps - The initial props for the page component.
 * @return {JSX.Element} The rendered app.
 *
 * @throws {TypeError} If `Component` is not a valid React component.
 * @example
 * // Example usage of NoteSwap component
 * <MyApp Component={Home} pageProps={{ initialData: data }} />
 *
 * @date 6/4/2023 - 3:01:24 PM
 * @author Sami Laayouni
 * @license MIT
 */
function NoteSwap({ Component, pageProps }) {
  // Headers in every single page
  const headers = (
    <>
      <Head>
        <meta charset="UTF-8" />
        <title>Noteswap</title>

        <meta
          name="description"
          content="World’s leading online educational platform for earning community service hours using AI to validate. Discover a new way to earn your community service hours."
        />
        <meta
          name="keywords"
          content="community service, education, AI, online"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#40b385" />

        <meta property="og:title" content="Noteswap" />
        <meta
          property="og:description"
          content="World’s leading online educational platform for earning community service hours using AI to validate. Discover a new way to earn your community service hours."
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/noteswap-images/circle.png"
        />
        <meta property="og:url" content="https://noteswap.org" />

        <meta name="twitter:title" content="Noteswap" />
        <meta
          name="twitter:description"
          content="World’s leading online educational platform for earning community service hours using AI to validate. Discover a new way to earn your community service hours."
        />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/noteswap-images/circle.png"
        />
        <meta name="twitter:card" content="Noteswap Icon" />
        <link rel="manifest" href="/manifest.json" />

        <link
          rel="icon"
          type="image/x-icon"
          href="/assets/icons/favicons/main.ico"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/icons/icons/circle.png"
        ></link>
      </Head>
    </>
  );
  // Return the JSX element
  return (
    <>
      {headers} {/* Headers */}
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </>
  );
}
// Export the Noteswap app
export default appWithTranslation(NoteSwap);
