import style from "../styles/AI.module.css";
export default function AddVector() {
  return (
    <div className={style.grid}>
      <form
        className={style.left}
        onSubmit={async (e) => {
          e.preventDefault();
          if (document.getElementById("category").value == "handbook") {
            document.getElementById("button").innerText = "Saving...";
            const response = await fetch(
              "/api/ai/handbook/vector/populate_data",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  text: document.getElementById("text").value,
                  category: "handbook",
                }),
              }
            );
            if (response.ok) {
              document.getElementById("button").innerText = "Saved";
            } else {
              document.getElementById("button").innerText =
                await response.text();
            }
          } else {
            document.getElementById("button").innerText = "Saving...";
            const response = await fetch(
              "/api/ai/handbook/vector/populate_data",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  text: document.getElementById("text").value,
                  category: "privacy",
                }),
              }
            );
            if (response.ok) {
              document.getElementById("button").innerText = "Saved";
            } else {
              document.getElementById("button").innerText =
                await response.text();
            }
          }
        }}
      >
        <h1>Add information on your school</h1>

        <textarea id="text" placeholder="Enter information" required />
        <input
          id="category"
          style={{
            display: "block",
            width: "80%",
            paddingLeft: "20px",
            height: "40px",
            outline: "none",
            marginTop: "20px",
          }}
          placeholder="Category"
          required
        ></input>
        <button id="button" className={style.button}>
          Submit
        </button>
      </form>
    </div>
  );
}
