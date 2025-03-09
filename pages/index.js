/* Home/Landing Page */

import Footer from "../components/Layout/Footer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Header from "../components/New/Header";
import { Hero } from "../sections/Hero/Hero";
import { LogoTicker } from "../sections/LogoTicker/LogoTicker";
import { ProductShowcase } from "../sections/ProductShowcase/ProductShowcase";
import { Features } from "../sections/Features/Features";
import { Testimonials } from "../sections/Testimonials/Testimonials";
import { LogoTickerSchools } from "../sections/LogoTickerSchools/LogoTicker";
import { CallToAction } from "../sections/CallToAction/CallToAction";
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

/**
 * Home Page (Landing page)
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/4/2023 - 3:02:38 PM
 * @author Sami Laayouni
 * @license MIT
 */
/**
 * Home component that renders the main page of the NoteSwap application.
 * It includes sections for hero, schools, associations, number of users, and FAQ.
 * It also handles user authentication and redirection based on user roles.
 *
 * @returns {JSX.Element} The JSX code for the Home component.
 */
export default function Home() {
  const { t } = useTranslation("common");

  // Return the JSX
  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <LogoTickerSchools />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer /> {/* Footer component */}
    </>
  );
}
