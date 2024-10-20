/* The Page Not Found (error 404) page displayed whenever the user visits 
a page that does not exist*/

import Head from "next/head";
import style from "../styles/RewardCS.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import LoadingCircle from "../components/Extra/LoadingCircle";
import { useRouter } from "next/router";
import { requireAuthenticationTeacher } from "../middleware/teacher";
import Script from "next/script";
import { useTranslation } from "next-i18next";

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
  const [task, setTask] = useState("");
  const router = useRouter();
  async function fetchStudents() {
    const data = await fetch("/api/schools/get_cs_for_students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: JSON.parse(localStorage?.getItem("userInfo"))?.schoolId,
      }),
    });
    if (data.ok) {
      const students = await data.json();
      console.log(students.students);

      setData(students.students);
      setLoading(false);
    } else {
      setError(t("error"));
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchStudents();
  }, []);

  const { t } = useTranslation("common");

  function formatMessagesWithMinutes(points, tutor_hours, messagesArray) {
    let formattedMessages = "";
    if (points != 0) {
      formattedMessages += `${Math.floor(points / 20)} ${t("minute")}${
        Math.floor(points / 20) == 1 ? "" : "s"
      } ${t("typing_and_sharing")}\n\t`;
    }
    if (tutor_hours != 0) {
      formattedMessages += `${Math.floor(tutor_hours / 60)} ${t("minute")}${
        Math.floor(tutor_hours / 60) == 1 ? "" : "s"
      } ${t("tutoring_other")}\n\t`;
    }
    if (messagesArray) {
      messagesArray.forEach((obj) => {
        if (obj.message && obj.minutes !== undefined) {
          formattedMessages += `${obj.minutes} ${t("minute")}${
            obj.minutes == 1 ? "" : "s"
          } ${t("for")} ${obj.message}\n\t`;
        }
      });
    }
    return formattedMessages;
  }

  async function downloadDataAsExcel() {
    const modifiedData = data.map((item) => {
      const { _id, first_name, last_name, points, tutor_hours, breakdown } =
        item;
      const fixed_first_name =
        first_name.charAt(0).toUpperCase() + first_name.slice(1);
      const fixed_last_name =
        last_name.charAt(0).toUpperCase() + last_name.slice(1);
      const totalPoints = `${
        Math.floor(item?.points / 20) + Math.floor(item?.tutor_hours / 60)
      } ${t("minute")}${
        Math.floor(item?.points / 20) + Math.floor(item?.tutor_hours / 60) == 1
          ? ""
          : "s"
      }`;
      Math.floor(item?.points / 20) + Math.floor(item?.tutor_hours / 60);

      console.log(breakdown);
      const full_breakdown = formatMessagesWithMinutes(
        points,
        tutor_hours,
        breakdown
      );

      return { fixed_first_name, fixed_last_name, totalPoints, full_breakdown };
    });
    const headers = [
      t("student_first_name"),
      t("student_last_name"),
      t("total_cs_earned"),
      t("breakdown_cs"),
    ]; // Add titles for columns

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...modifiedData.map(Object.values),
    ]);
    workbook.SheetNames.push("_CS");
    workbook.Sheets["_CS"] = worksheet;

    // (C3) "FORCE DOWNLOAD" XLSX FILE
    XLSX.writeFile(workbook, "_CS.xlsx");
  }

  async function downloadDataAsCSV() {
    const modifiedData = data.map((item) => {
      const {
        _id,
        first_name,
        last_name,
        points,
        tutor_hours,
        breakdown,
        ...rest
      } = item; // Extract Student First Name and Last Name
      const totalPoints =
        Math.floor(item?.points / 20) + Math.floor(item?.tutor_hours / 60);

      const full_breakdown = formatMessagesWithMinutes(
        points,
        tutor_hours,
        breakdown
      );

      return { first_name, last_name, ...rest, totalPoints, full_breakdown }; // Include Student First Name and Last Name in the modified data
    });

    const headers = [
      t("student_first_name"),
      t("student_last_name"),
      t("total_cs_earned"),
      t("breakdown_cs"),
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
      link.setAttribute("download", "_CS.csv");
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
        <title>{t("reward_cs_full")} | NoteSwap</title> {/* Title of the page*/}
      </Head>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" />

      <section className={style.container}>
        <h1>{t("students_list")}</h1>
        {loading && <LoadingCircle />}
        {error}
        {!loading && !error && (
          <>
            <div className={style.grid}>
              <p>{t("download_cs_as")}</p>
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
                  <th>{t("students_name")}</th>
                  <th>{t("total_cs_earned")}</th>
                  <th>{t("reward_cs_in_min")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.map(function (value) {
                  if (search) {
                    if (!value.first_name.toLowerCase().includes(search)) {
                      return <></>;
                    }
                  }
                  const totalMinutes = value?.breakdown?.reduce(
                    (accumulator, currentValue) => {
                      return accumulator + parseInt(currentValue.minutes);
                    },
                    0
                  );
                  return (
                    <tr key={`tableRow${value._id}`}>
                      <td
                        onClick={() => {
                          router.push(`/profile/${value._id}`);
                        }}
                      >
                        {" "}
                        <b>
                          {value.first_name.charAt(0).toUpperCase() +
                            value.first_name.slice(1)}{" "}
                          {value.last_name.charAt(0).toUpperCase() +
                            value.last_name.slice(1)}
                        </b>
                        <ul style={{ paddingLeft: "0px", listStyle: "none" }}>
                          {value?.points != 0 &&
                            value.breakdown &&
                            value?.points - totalMinutes * 20 != 0 && (
                              <li>
                                {t("sharing_noteswap")} (
                                {Math.round(
                                  (value?.points - totalMinutes * 20) / 20
                                )}{" "}
                                {t("minute")}
                                {Math.round(
                                  (value?.points - totalMinutes * 20) / 20
                                ) == 1
                                  ? ""
                                  : "s"}{" "}
                                )
                              </li>
                            )}
                          {value?.points != 0 && !value.breakdown && (
                            <li>
                              {t("sharing_noteswap")} (
                              {Math.round(value?.points / 20)} {t("minute")}
                              {Math.round(value?.points / 20) == 1 ? "" : "s"})
                            </li>
                          )}
                          {value?.tutor_hours != 0 && (
                            <li>
                              {t("tutoring_noteswap")} (
                              {Math.floor(value.tutor_hours / 60)} {t("minute")}
                              {Math.floor(value.tutor_hours / 60) == 1
                                ? ""
                                : "s"}
                              )
                            </li>
                          )}

                          {value?.breakdown?.map(function (value, index) {
                            return (
                              <li key={index}>
                                {value.message} ({value.minutes} {t("minute")}
                                {value.minutes == 1 ? "" : "s"})
                              </li>
                            );
                          })}
                        </ul>
                      </td>
                      <td>
                        <p id={`amount_community_${value._id}`}>
                          {" "}
                          {value?.points || value?.tutor_hours
                            ? Math.floor(value?.points / 20) +
                              Math.floor(value?.tutor_hours / 60)
                            : "0"}{" "}
                          {t("minute")}
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
                            const currentDate = new Date();
                            // Format the date
                            const options = {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            };
                            const formattedDate =
                              currentDate.toLocaleDateString("en-US", options);

                            await fetch("/api/profile/add_task", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                id: value._id,
                                task: {
                                  message: `${
                                    document.getElementById(
                                      `input1_${value._id}`
                                    ).value
                                  }`,
                                  minutes: document.getElementById(
                                    `input_${value._id}`
                                  ).value,
                                  rewardedOn: formattedDate,
                                  organization: `${
                                    JSON.parse(localStorage.getItem("userInfo"))
                                      .first_name
                                  } ${
                                    JSON.parse(localStorage.getItem("userInfo"))
                                      .last_name
                                  }`,
                                },
                              }),
                            });
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
                              width: "28%",
                              transition: "border-color 0.3s ease-in-out",
                              verticalAlign: "middle",
                            }}
                            id={`input1_${value._id}`}
                            placeholder={t("enter_task_name")}
                            onChange={(e) => {
                              setTask(e.target.value);
                            }}
                            type="text"
                            value={task}
                            required
                          ></input>
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
                              width: "40%",
                              marginLeft: "10px",
                              transition: "border-color 0.3s ease-in-out",
                              verticalAlign: "middle",
                            }}
                            id={`input_${value._id}`}
                            placeholder={t("enter_amount_in_min")}
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
                            {t("reward")}
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
        {!loading && data?.length == 0 && <p>{t("no_students_found")}</p>}
      </section>
    </>
  );
};
// End of the Reward Community Service Page
export default requireAuthenticationTeacher(RewardCommunityService);
