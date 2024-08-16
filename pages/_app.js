/* The main app directory for NEXTJS*/

// Import styles
import "../styles/globals.css";
import "../styles/fonts.css";
import "../styles/quill.css";

// Import Head
import Head from "next/head";
// Import the default layout
import DefaultLayout from "../layouts/DefaultLayout";
// Import translations
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
        <meta charSet="UTF-8" />
        <title>NoteSwap</title>
        <meta
          name="description"
          content="Everyone deserves a world full  with opportunities. Volunteer at events. Purchase tickets. Share your notes. Tutor students. Together, we can make a difference. "
        />
        <meta
          name="keywords"
          content="tickets, events, notes, tutor, community service, education, AI, online"
        />
        <script async src="https://pay.google.com/gp/p/js/pay.js"></script>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#40b385" />
        <meta property="og:title" content="NoteSwap" />
        <meta
          property="og:description"
          content="Everyone deserves a world full  with opportunities. Volunteer at events. Purchase tickets. Share your notes. Tutor students. Together, we can make a difference."
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/noteswap-images/circle.png"
        />
        <meta property="og:url" content="https://noteswap.org" />
        <meta name="twitter:title" content="NoteSwap" />
        <meta
          name="twitter:description"
          content="Everyone deserves a world full  with opportunities. Volunteer at events. Purchase tickets. Share your notes. Tutor students. Together, we can make a difference."
        />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/noteswap-images/circle.png"
        />
        <meta name="twitter:card" content="NoteSwap Icon" />
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
// Export the NoteSwap app
export default appWithTranslation(NoteSwap);
//End of the app directory
