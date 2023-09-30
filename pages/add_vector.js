/* This page allows admins to add extra information to train the 
school handbook AI on */

// Import the style
import style from "../styles/AI.module.css";
export default function AddVector() {
  // Return the JSX
  return (
    <div className={style.grid}>
      <form
        className={style.left}
        onSubmit={async (e) => {
          // Prevent the page from reloading
          e.preventDefault();
          // Check if we are adding information to the handbook
          if (document.getElementById("category").value == "handbook") {
            // We are
            // Notify the user that we are saving the changes
            document.getElementById("button").innerText = "Saving...";
            // Add information to the vector database
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
            // The response was succesful
            if (response.ok) {
              document.getElementById("button").innerText = "Saved";
            } else {
              // An error has occured
              document.getElementById("button").innerText =
                await response.text();
            }
          } else {
            // We are not
            // Notify the user that we are saving the changes
            document.getElementById("button").innerText = "Saving...";
            // Add information to the vector database
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
            // The response was ok
            if (response.ok) {
              document.getElementById("button").innerText = "Saved";
            } else {
              // An error has occured
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
