/* The Page Not Found (error 404) page displayed whenever the user visits 
a page that does not exist*/

import Head from "next/head";
import style from "../styles/RewardCS.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import LoadingCircle from "../components/LoadingCircle";
import { useRouter } from "next/router";
import { requireAuthenticationTeacher } from "../middleware/teacher";
import Script from "next/script";

/**
 * Get static props
 * @date 8/13/2023 - 4:31:01 PM
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
 * Reward Community Service
 * @date 7/3/2023 - 12:50:32 PM
 *
 * @export
 * @return {JSX.Element} the rendered Reward Community Service page
 */
const RewardCommunityService = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();
  async function fetchStudents() {
    const data = await fetch("/api/schools/get_cs_for_students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (data.ok) {
      const students = await data.json();

      setData(students.students);
      setLoading(false);
    } else {
      setError("An error has occurred!");
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchStudents();
  }, []);

  async function downloadDataAsExcel() {
    const modifiedData = data.map((item) => {
      const { _id, first_name, last_name, points, tutor_hours } = item;
      const fixed_first_name =
        first_name.charAt(0).toUpperCase() + first_name.slice(1);
      const fixed_last_name =
        last_name.charAt(0).toUpperCase() + last_name.slice(1);
      const totalPoints = `${
        Math.floor(item?.points / 20) + Math.floor(item?.tutor_hours / 60)
      } minute${
        Math.floor(item?.points / 20) + Math.floor(item?.tutor_hours / 60) == 1
          ? ""
          : "s"
      }`;
      Math.floor(item?.points / 20) + Math.floor(item?.tutor_hours / 60);
      return { fixed_first_name, fixed_last_name, totalPoints };
    });
    const headers = [
      "Student First Name",
      "Student Last Name",
      "Total Community Service Earned",
    ]; // Add titles for columns

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...modifiedData.map(Object.values),
    ]);
    workbook.SheetNames.push("Noteswap_CS");
    workbook.Sheets["Noteswap_CS"] = worksheet;

    // (C3) "FORCE DOWNLOAD" XLSX FILE
    XLSX.writeFile(workbook, "Noteswap_CS.xlsx");
  }

  async function downloadDataAsCSV() {
    const modifiedData = data.map((item) => {
      const { _id, first_name, last_name, points, tutor_hours, ...rest } = item; // Extract Student First Name and Last Name
      const totalPoints =
        Math.floor(item?.points / 20) + Math.floor(item?.tutor_hours / 60);
      return { first_name, last_name, ...rest, totalPoints }; // Include Student First Name and Last Name in the modified data
    });

    const headers = [
      "Student First Name",
      "Student Last Name",
      "Total Community Service Earned",
    ]; // Add titles for columns, including Points
    const values = modifiedData.map((item) => [...Object.values(item)]); // Include Student First Name, Last Name, and Points in each row

    // Create CSV content
    let csvContent = headers.join(",") + "\n";
    csvContent += values.map((row) => row.join(",")).join("\n");

    // (C3) "FORCE DOWNLOAD" CSV FILE
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Noteswap_CS.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Safari workaround
      window.open("data:text/csv;charset=utf-8," + escape(csvContent));
    }
  }

  // Return the JSX
  return (
    <>
      <Head>
        <title>Reward Community Service | NoteSwap</title>{" "}
        {/* Title of the page*/}
      </Head>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" />

      <section className={style.container}>
        <h1>Students List</h1>
        {loading && <LoadingCircle />}
        {error}
        {!loading && !error && (
          <>
            <div className={style.grid}>
              <p>Download All Students Community Service as</p>
              <div className={style.button}>
                <button
                  onClick={() => {
                    downloadDataAsExcel();
                  }}
                >
                  Excel
                </button>
                <button
                  onClick={() => {
                    downloadDataAsCSV();
                  }}
                >
                  CSV
                </button>
              </div>
            </div>
            <input
              style={{
                outline: "none",
                boxShadow: "none",
                fontWeight: "400",
                fontFamily: "var(--primary-font)",
                lineHeight: "20px",
                borderRadius: "var(--third-party-login-card-radius)",
                fontSize: "16px",
                border: "1px solid var(--input-border-color)",
                paddingLeft: "15px",
                height: "42px",
                marginTop: "30px",
                width: "100%",
                transition: "border-color 0.3s ease-in-out",
                verticalAlign: "middle",
              }}
              placeholder="Search by student's first name"
              onChange={(e) => {
                setSearch(e.target.value.toLowerCase());
              }}
            ></input>
            <table className={style.styledTable} border="1">
              <thead style={{ fontFamily: "var(--bold-manrope-font)" }}>
                <tr>
                  <th>Student&apos;s Name</th>
                  <th>Total Community Service Earned</th>
                  <th>Reward Community Service (in minutes)</th>
                </tr>
              </thead>
              <tbody>
                {data.map(function (value) {
                  if (search) {
                    if (!value.first_name.toLowerCase().includes(search)) {
                      return <></>;
                    }
                  }
                  return (
                    <tr key={`tableRow${value._id}`}>
                      <td
                        onClick={() => {
                          router.push(`/profile/${value._id}`);
                        }}
                      >
                        {" "}
                        {value.first_name.charAt(0).toUpperCase() +
                          value.first_name.slice(1)}{" "}
                        {value.last_name.charAt(0).toUpperCase() +
                          value.last_name.slice(1)}
                      </td>
                      <td>
                        <p id={`amount_community_${value._id}`}>
                          {" "}
                          {value?.points || value?.tutor_hours
                            ? Math.floor(value?.points / 20) +
                              Math.floor(value?.tutor_hours / 60)
                            : "0"}{" "}
                          minute
                          {Math.floor(value?.points / 20) +
                            Math.floor(value?.tutor_hours / 60) ==
                          1
                            ? ""
                            : "s"}
                        </p>
                      </td>
                      <td>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const response = await fetch(
                              "/api/profile/add_community_minutes",
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  id: value._id,
                                  points:
                                    document.getElementById(
                                      `input_${value._id}`
                                    ).value * 20,
                                }),
                              }
                            );
                            if (response.ok) {
                              document.getElementById(
                                `reward_button_${value._id}`
                              ).innerText = "Success";

                              document.getElementById(
                                `input_${value._id}`
                              ).value = "";
                              fetchStudents();
                            } else {
                              document.getElementById(
                                `reward_button_${value._id}`
                              ).innerText = "An error has occurred";
                              document.getElementById(
                                `input_${value._id}`
                              ).value = "";
                            }
                          }}
                        >
                          <input
                            style={{
                              outline: "none",
                              boxShadow: "none",
                              fontWeight: "400",
                              fontFamily: "var(--primary-font)",
                              lineHeight: "20px",
                              borderRadius:
                                "var(--third-party-login-card-radius)",
                              fontSize: "16px",
                              border: "1px solid var(--input-border-color)",
                              paddingLeft: "15px",
                              height: "32px",
                              width: "75%",
                              transition: "border-color 0.3s ease-in-out",
                              verticalAlign: "middle",
                            }}
                            id={`input_${value._id}`}
                            placeholder={`Enter amount to reward ${value.first_name} (in mins)`}
                            type="number"
                            min={1}
                            max={10000}
                            required
                          ></input>
                          <button
                            id={`reward_button_${value._id}`}
                            style={{
                              height: "32px",
                              background: "var(--accent-color)",
                              paddingLeft: "20px",
                              paddingRight: "20px",
                              borderRadius: "3px",
                              border: "none",
                              color: "white",
                              marginLeft: "10px",
                              cursor: "pointer",
                            }}
                          >
                            Reward
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
        {!loading && data.length == 0 && <p>No students found</p>}
      </section>
    </>
  );
};
// End of the Reward Community Service Page
export default requireAuthenticationTeacher(RewardCommunityService);
