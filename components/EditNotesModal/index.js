import Modal from "../Modal";
import { useContext, useEffect, useState } from "react";
import ModalContext from "../../context/ModalContext";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import style from "./EditNotesModal.module.css";

/**
 * React Quil
 * @date 7/24/2023 - 7:30:32 PM
 *
 * @type {*}
 */
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Custom Quill module for KaTeX rendering
/**
 * Custom Quill module for KaTeX rendering
 * @date 7/24/2023 - 7:30:32 PM
 *
 * @type {{ matcher: {}; format: (text: any) => string; render: (text: any, delta: any) => void; }}
 */
const katexModule = {
  matcher: /(?:\$)(.*?)(?:\$)/g,
  format: (text) => `$${text}$`,
  render: (text, delta) => {
    const katexOptions = {
      throwOnError: false,
      displayMode: false,
    };
    const value = text.slice(1, -1);
    const html = katex.renderToString(value, katexOptions);
    delta.insert({ formula: true, html });
  },
};

export default function EditNotesModal() {
  const { edit, editValue, editTitle, editId } = useContext(ModalContext);
  const [open, setOpen] = edit;
  const [value, setValue] = editValue;
  const [title, setTitle] = editTitle;
  const [error, setError] = useState("");
  const [id] = editId;

  useEffect(() => {
    window.katex = katex;
  }, [open]);

  // Handle change in the rich textarea
  const handleChange = (value) => {
    setValue(value);
  };
  // Handle change in the title
  const handleChangeTitle = (value) => {
    setTitle(value.target.value);
  };

  if (!open) {
    return null;
  }
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title="Edit notes"
    >
      <section style={{ width: "75vw" }}>
        <input
          value={title}
          onChange={handleChangeTitle}
          className={style.input}
          placeholder="Enter title"
          autoFocus
          required
          minLength={3}
          maxLength={100}
        />
        <ReactQuill
          id="reactQuill"
          value={value}
          onChange={handleChange}
          theme="snow"
          placeholder="Start something wonderful..."
          modules={{
            toolbar: [
              [{ size: ["small", false, "large", "huge"] }],
              [
                "bold",
                "italic",
                "underline",
                "strike",
                { script: "super" },
                { script: "sub" },
              ],
              [{ color: [] }, { background: [] }],
              [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
              ["formula", "code-block"],

              ["clean"],
            ],
            formula: {
              delay: 1000, // Delay for rendering formulas
              modules: ["katex"], // Enable KaTeX module
              formula: katexModule, // Custom KaTeX module
            },
          }}
          style={{
            height: "250px",
            width: "65vw",
            marginTop: "40px",
            outline: "none",
            fontFamily: "var(--manrope-font)",
          }}
        />
        {error}
        <button
          id="edit"
          onClick={async () => {
            document.getElementById("edit").innerText = "Editing...";
            const response = await fetch("/api/notes/edit_notes", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: id,
                title: title,
                value: value,
              }),
            });
            if (response.ok) {
              document.getElementById("edit").innerText = "Edit";
              setOpen(false);
            } else {
              setError(await response.text());
            }
          }}
          className={style.next}
          type="submit"
        >
          Edit
        </button>
      </section>
    </Modal>
  );
}
