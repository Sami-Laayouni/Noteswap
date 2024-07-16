/* Compoenent used in the dashboard page in order to display the 
school's events. */

// Import the style
import style from "./calendarEvent.module.css";
// Import from NEXTJS
import Link from "next/link";
// Used for simplification in handling dates
import { format, parseISO, addDays, isSameDay } from "date-fns";
import { useTranslation } from "next-i18next";

/**
 * Calendar Event
 * @date 8/13/2023 - 5:07:27 PM
 *
 * @export
 * @param {{ data: any; }} { data }
 * @return {*}
 */
export default function CalendarEvent({ data }) {
  const startDate = parseISO(data?.start?.dateTime); // Start date of the event
  const endDate = parseISO(data?.end?.dateTime); // End date of the event
  const nextDayDate = addDays(startDate, 1); // The day after the event
  const { t } = useTranslation("common");
  console.log(data);

  // Return the JSX (a link that opens the event in their Google calendar)
  return (
    <Link href={data?.htmlLink} target="_blank">
      <li key={data?.id} className={style.container}>
        <h1>{data?.summary}</h1>
        <p>
          {!data?.start?.dateTime
            ? t("all_day")
            : `${format(parseISO(data?.start?.dateTime), "HH:mm")} - 
          ${format(parseISO(data?.end?.dateTime), "HH:mm")}`}
          {" · "}
          {isSameDay(startDate, endDate)
            ? `${format(startDate, "MMMM dd, yyyy")}`
            : isSameDay(nextDayDate, endDate)
            ? `${format(startDate, "MMMM dd, yyyy")}`
            : ` ${format(startDate, "MMMM dd, yyyy")} - 
          ${format(addDays(endDate, -1), "MMMM dd, yyyy")}`}
        </p>

        <p>
          {data?.description ? data?.description : t("no_description_found")}
        </p>
      </li>
    </Link>
  );
}
// End of the component
