import "../styles/globals.css";
import "../styles/fonts.css";
import Head from "next/head";
import DefaultLayout from "../layouts/DefaultLayout";

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
  const headers = (
    <>
      <Head>
        <title>Noteswap</title>
      </Head>
    </>
  );
  return (
    <>
      {headers}

      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </>
  );
}

export default NoteSwap;
