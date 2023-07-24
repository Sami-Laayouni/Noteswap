import Image from "next/image";
import { useRouter } from "next/router";

/**
 * Profile picture
 * @date 7/24/2023 - 7:34:24 PM
 *
 * @export
 * @param {{ src: any; alt: any; id: any; }} { src, alt, id }
 * @return {*}
 */
export default function ProfilePicture({ src, alt, id }) {
  const router = useRouter();
  const handleImageError = (event) => {
    event.target.onerror = null; // Prevent infinite loop
    event.target.src = "/assets/fallback/user.webp";
  };
  if (!src) {
    return <></>;
  }
  if (!alt) {
    return <></>;
  }
  return (
    <Image
      style={{
        borderRadius: "50%",
        display: "inline-block",
        cursor: "pointer",
        verticalAlign: "middle",
      }}
      src={src}
      alt={alt}
      width={40}
      height={40}
      onError={handleImageError}
      onClick={() => {
        router.push(`/profile/${id}`);
      }}
    />
  );
}
