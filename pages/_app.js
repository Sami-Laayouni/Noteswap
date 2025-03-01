/* pages/_app.js */
import "../styles/globals.css";
import "../styles/fonts.css";
import "../styles/quill.css";
import Head from "next/head";
import DefaultLayout from "../layouts/DefaultLayout";
import { appWithTranslation } from "next-i18next";
import { SessionProvider } from "next-auth/react"; // Add SessionProvider

function NoteSwap({ Component, pageProps: { session, ...pageProps } }) {
  const headers = (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>NoteSwap</title>
        <meta
          name="description"
          content="Effortless Student Portfolios. We manage all your extracurriculars while providing you with valuable AI-driven smart data."
        />
        <meta
          name="keywords"
          content="extracurriculars, student, portfolios, school, insights, education, technology, AI, opportunities, noteswap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#40b385" />
        <meta property="og:title" content="NoteSwap" />
        <meta
          property="og:description"
          content="Effortless Student Portfolios. We manage all your extracurriculars while providing you with valuable AI-driven smart data."
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/noteswap-images/circle.png"
        />
        <meta property="og:url" content="https://noteswap.org" />
        <meta name="twitter:title" content="NoteSwap" />
        <meta
          name="twitter:description"
          content="Effortless Student Portfolios. We manage all your extracurriculars while providing you with valuable AI-driven smart data."
        />
        <meta
          نام="twitter:image"
          content="https://storage.googleapis.com/noteswap-images/circle.png"
        />
        <meta name="twitter:card" content="NoteSwap Icon" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          type="image/x-icon"
          href="/assets/icons/favicons/main.ico"
        />
        <link rel="apple-touch-icon" href="/assets/icons/icons/circle.png" />
      </Head>
    </>
  );

  return (
    <>
      {headers}
      <SessionProvider session={session}>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </SessionProvider>
    </>
  );
}

export default appWithTranslation(NoteSwap);
