import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * Get static props
 * @date 8/13/2023 - 4:47:18 PM
 *
 * @export
 * @async
 * @param {{ locale: any; }} { locale }
 * @return {unknown}
 */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
/**
 * Privacy Policy
 * @date 7/24/2023 - 7:08:35 PM
 *
 * @export
 * @return {*}
 */
export default function PrivacyPolicy() {
  return <div>PrivacyPolicy</div>;
}
