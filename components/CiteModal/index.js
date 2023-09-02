import Modal from "../Modal";
import { useContext } from "react";
import ModalContext from "../../context/ModalContext";
import style from "./citeModal.module.css";
import { MdContentCopy } from "react-icons/md";

function generateCitation(data, style) {
  const { firstName, lastName, date, title, url, platform } = data;
  switch (style.toLowerCase()) {
    case "mla9":
      return `${lastName}, ${firstName}. "<i>${title}</i>." ${platform}, ${date}, <a href="${url}">${url}</a>.`;

    case "apa7":
      return `${lastName[0].toUpperCase()}${lastName.slice(
        1
      )}, ${firstName[0].toUpperCase()}. (${date}). <i>${title}</i>. ${platform}. <a href="${url}">${url}</a>.`;

    case "chicago":
      return `${lastName}, ${firstName}. "<i>${title}</i>." ${platform}, ${date}. ${url}.`;

    case "ieee":
      return `[1] ${
        firstName[0]
      }. ${lastName}, "<i>${platform}</i>" ${title}, ${date}. [Online]. Available: <a href="${url}">${url}</a> (accessed ${new Date().toLocaleDateString()}).`;

    case "harvard":
      return `${lastName}, ${
        firstName[0]
      }. (${date}). <i>${platform}</i>, <i>${title}</i>. [Online]. Available at: <a href="${url}">${url}</a> [Accessed ${new Date().toLocaleDateString()}].`;
    case "mla9n":
      return `${lastName}, ${firstName}. "${title}." ${platform}, ${date}, ${url}`;

    case "apa7n":
      return `${lastName[0].toUpperCase()}${lastName.slice(
        1
      )}, ${firstName[0].toUpperCase()}. (${date}). ${title}. ${platform}. ${url}`;

    case "chicagon":
      return `${lastName}, ${firstName}. "${title}." ${platform}, ${date}. ${url}.`;

    case "ieeen":
      return `[1] ${
        firstName[0]
      }. ${lastName}, "${platform}" ${title}, ${date}. [Online]. Available: ${url} (accessed ${new Date().toLocaleDateString()}).`;

    case "harvardn":
      return `${lastName}, ${
        firstName[0]
      }. (${date}). ${platform}, ${title}. [Online]. Available at: ${url} [Accessed ${new Date().toLocaleDateString()}].`;

    default:
      return "Unsupported citation style";
  }
}
export default function CiteModal() {
  const { citeOpen, citeInfo } = useContext(ModalContext);
  const [open, setOpen] = citeOpen;
  const [data] = citeInfo;
  if (!open) {
    return null;
  }
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title="Cite these notes"
    >
      <section style={{ width: "75vw" }}>
        <ul className={style.list}>
          {["mla9", "apa7", "chicago", "ieee", "harvard"].map(
            (citationStyle) => (
              <li key={citationStyle}>
                <h1 style={{ display: "inline" }}>
                  {citationStyle.toUpperCase()}
                </h1>{" "}
                <MdContentCopy
                  style={{ display: "inline", cursor: "pointer" }}
                  color="var(--accent-color)"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      generateCitation(data, `${citationStyle}n`)
                    );
                  }}
                />
                <h2
                  onClick={() => {
                    navigator.clipboard.writeText(
                      generateCitation(data, `${citationStyle}n`)
                    );
                  }}
                  dangerouslySetInnerHTML={{
                    __html: generateCitation(data, citationStyle),
                  }}
                ></h2>
              </li>
            )
          )}
        </ul>
      </section>
    </Modal>
  );
}
