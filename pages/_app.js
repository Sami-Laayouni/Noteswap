import "../styles/globals.css";

/**
 * Custom App component for Next.js.
 *
 * @param {AppProps} props - The props for the App component.
 * @returns {JSX.Element} The rendered component.
 */

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
