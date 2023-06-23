import style from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";

/**
 * Footer
 *
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
export default function Footer() {
  return (
    <footer className={style.footer}>
      <section className={style.footer_top}>
        <h1>Ready to get started?</h1>
        <h2>
          If you have a general inquiry and would like to speak to our expert
          team, you can contact us via email at: noteswap@gmail.com
        </h2>
        <Link href="/signup">
          <button>Get Started</button>
        </Link>
      </section>
      <div className={style.borderLine}></div>
      <section className={style.footer_bottom}>
        <Image
          src="assets/icons/Logo_dark.svg"
          alt="Logo_dark"
          width={166}
          height={51}
        />
        <p>© 2023 All Rights Reserved. </p>
        <div>
          <Image
            src="/assets/images/footer/Facebook.svg"
            alt="Facebook"
            width={33}
            height={33}
          />
          <Link href="https://twitter.com/NoteSwap_Ifrane">
            <Image
              src="/assets/images/footer/Twitter.svg"
              alt="Twitter"
              width={33}
              height={33}
            />
          </Link>

          <Link href="https://www.linkedin.com/in/note-swap-837707280/">
            <Image
              src="/assets/images/footer/Linkedin.svg"
              alt="Linkedin"
              width={33}
              height={33}
            />
          </Link>
        </div>
      </section>
    </footer>
  );
}
