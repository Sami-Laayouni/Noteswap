import Modal from "../Modal";
import { useContext } from "react";
import ModalContext from "../../context/ModalContext";
import style from "./expandedEvent.module.css";
export default function ExpandedEvent() {
  const { eventState, eventData } = useContext(ModalContext);
  const [open, setOpen] = eventState;
  const [data, setData] = eventData;
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title={`${data.title}`}
      small="true"
    >
      <section
        style={{
          width: "75vw",
          display: "grid",
          gridTemplateColumns: "30% 3% 30% 3% 30%",
          paddingTop: "20px",
          paddingBottom: "10px",
        }}
        className={style.container}
      >
        <div>
          <h1>Basic Information</h1>
          <p>
            <span>Title:</span> {data?.title}
          </p>
          <p>
            <span>Community Service Offered:</span>{" "}
            {data?.community_service_offered} hour
            {data?.community_service_offered == 1 ? "" : "s"}
          </p>
          <p>
            <span>Location:</span>{" "}
            {data?.location ? data?.location : "No location specified"}
          </p>
          <p>
            <span>Category:</span> {data?.category}
          </p>
        </div>
        <div className={style.line}></div>
        <div>
          <h1>Additional Information</h1>
          <p>
            <span>Description:</span> {data?.desc}
          </p>
          <p>
            <span>Requirements to join: </span>{" "}
            {data?.req ? data.req : "No requirements to join this event"}{" "}
          </p>
        </div>
        <div className={style.line}></div>
        <div>
          <h1>Advanced</h1>
          <p>
            <span>Maximum number of students that can sign up:</span>{" "}
            {data?.max}
          </p>
          <p>
            <span>Number of students that signed up:</span>{" "}
            {data?.volunteers?.length}
          </p>
          <p>
            <span>Contact Email:</span> {data?.contact_email}
          </p>
        </div>
      </section>
    </Modal>
  );
}
