import style from "./calendarEvent.module.css";
import Link from "next/link";
/**
 * Calendar Event
 * @date 8/13/2023 - 5:07:27 PM
 *
 * @export
 * @param {{ data: any; }} { data }
 * @return {*}
 */
export default function CalendarEvent({ data }) {
  return (
    <Link href={data.htmlLink} target="_blank">
      <li key={data.id} className={style.container}>
        <h1>{data.summary}</h1>
        <p>
          {!data.start.dateTime
            ? "All day"
            : `${format(parseISO(data.start.dateTime), "MMMM dd, yyyy - HH:mm")}
   - 
  ${format(parseISO(data.end.dateTime), "HH:mm")}`}
          {" · "}
          <span>{data.location}</span>
        </p>

        <p>
          {data.description
            ? data.description
            : "No description found for this event."}
        </p>
      </li>
    </Link>
  );
}
