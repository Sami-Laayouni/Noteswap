import { useRouter } from "next/dist/client/router";
import style from "../../styles/Password.module.css";
import { useState, useEffect } from "react";

export default function Reset() {
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (router.query) {
      setId(router.query.id);
    }
  }, [router]);
  return (
    <div className={style.background}>
      <section className={style.container}>
        <h1>Reset your password</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (
              document.getElementById("password").value ==
              document.getElementById("passwordConfirm").value
            ) {
              const response = await fetch("/api/profile/change_password", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: id,
                  password: document.getElementById("password").value,
                }),
              });
              if (response.ok) {
                router.push("/login");
              } else {
                setError("An error has occured, please try again later.");
              }
            }
          }}
        >
          <input
            placeholder="Enter new password"
            className={style.input}
            type="text"
            id="password"
            minLength={8}
            required
          ></input>
          <input
            placeholder="Confirm new password"
            className={style.input}
            style={{ display: "block", marginTop: "10px" }}
            type="text"
            id="passwordConfirm"
            minLength={8}
            onChange={(e) => {
              if (e.target.value == document.getElementById("password").value) {
                setError(null);
              } else {
                setError("Passwords must match");
              }
            }}
            required
          ></input>
          <p>{error}</p>
          <button
            style={{ marginTop: "10px", marginLeft: "0px" }}
            className={style.button}
          >
            Confirm
          </button>
        </form>
      </section>
    </div>
  );
}
