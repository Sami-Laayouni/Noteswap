import { useContext, useEffect, useState } from "react";
import ModalContext from "../../../context/ModalContext";
import Modal from "../../Template/Modal";
import { useRouter } from "next/router";
import style from "../../../styles/Event.module.css";

export default function ApplyAsVolunteer() {
  const { applyAsVolunteer, eventData } = useContext(ModalContext);
  const [open, setOpen] = applyAsVolunteer;
  const [id, setId] = useState(null);
  const [teacher, setTeacher] = useState(false);
  const [isMember, setIsMember] = useState(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Check membership only if additional is 'allowAll'
    const checkMembership = async () => {
      if (data?.additional === "allowAll") {
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        if (userData?.association_list) {
          const userAssociations = userData?.association_list;
          const memberOfAssociation = userAssociations.some(
            (association) => association.id === data.associationId
          );

          if (memberOfAssociation) {
            setIsMember(true);
          } else {
            setIsMember(false);
          }
        }
      }
    };

    checkMembership();
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (localStorage && localStorage.getItem("userInfo")) {
      setTeacher(
        JSON.parse(localStorage.getItem("userInfo")).role == "teacher"
      );
      setId(JSON.parse(localStorage.getItem("userInfo"))._id);
    }
  }, [router]);

  const [data] = eventData;

  if (!open) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      onClose={() => setOpen(false)}
      title={"Apply As A Volunteer"}
    >
      <h1 style={{ fontFamily: "var(--manrope-bold-font)" }}>
        Before you apply ensure you have read the requirements below:
      </h1>
      {data?.req ? (
        <p style={{ fontFamily: "var(--manrope-font)" }}>{data?.req}</p>
      ) : (
        <>
          <i>No requirements to join this event</i>
          <br></br>
          <br></br>
        </>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // Retrieve the current user's ID
          const userId = JSON.parse(localStorage.getItem("userInfo"))._id;

          // Check if the 'additional' key is set to 'allowMeeting' and if the user is permitted in the 'attendance'
          if (
            data?.additional === "allowMeeting" &&
            !data?.attendance[userId]
          ) {
            // Prevent sign-up  the user; the button will already be disabled, no need to do anything here
            return;
          }

          // Check if the 'additional' key is set to 'allowAll' and check membership status
          if (data?.additional === "allowAll" && isMember === false) {
            return;
          }

          // Process the signup or unsignup based on whether the user is already a volunteer
          if (data?.volunteers?.some((v) => v.userId === id)) {
            const response = await fetch("/api/events/unsignup_event", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: data?._id,
                userId: userId,
              }),
            });
            if (response.ok) {
              document.getElementById(
                `${data._id}button`
              ).innerHTML = `Apply <span className={style.icon}>→</span>`;
              const index = data?.volunteers?.indexOf(userId);
              if (index > -1) {
                data?.volunteers?.splice(index, 1);
              }
            }
            setOpen(false);
          } else {
            const response = await fetch("/api/events/signup_event", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: data?._id,
                userId: userId,
                phone: phone,
              }),
            });

            document.getElementById(`${data._id}button`).innerText =
              "Un-apply as a volunteer";

            if (response.ok) {
              data?.volunteers?.push(userId);
              if (data?.link_to_event) {
                router.push(data?.link_to_event);
              }
            }
          }
        }}
      >
        {data?.volunteers?.some((v) => v.userId === id) ? (
          <></>
        ) : data?.askForPhone ? (
          <input
            style={{
              width: "100%",
              outline: "none",
              background: "white",
              border: "1px solid var(--accent-color)",
              height: "30px",
              borderRadius: "6px",
              paddingLeft: "15px",
              marginBottom: "10px",
            }}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            placeholder="Enter your phone number (+212 ...)"
            required
          />
        ) : (
          <></>
        )}
        <i style={{ fontFamily: "var(--manrope-font)" }}>
          Read the requirements?
        </i>
        <br></br>
        <button
          type="submit"
          className={style.button}
          id={`${data?._id}button`}
          disabled={
            !data?.volunteers?.some((v) => v.userId === id) && // Check if the userId exists in any object within the volunteers array
            (data?.volunteers?.length >= data?.max || // Check the number of volunteers
              (data?.additional === "allowMeeting" && !data?.attendance[id]) ||
              (data?.additional === "allowAll" && isMember === false))
          }
        >
          {data?.volunteers?.some((v) => v.userId === id) // Check if the userId exists in any object within the volunteers array
            ? "Un-apply as a volunteer"
            : data?.volunteers?.length >= data?.max || // Check the number of volunteers
              (data?.additional === "allowMeeting" && !data?.attendance[id]) ||
              (data?.additional === "allowAll" && isMember === false)
            ? "Cannot sign up for event"
            : "Apply as a volunteer"}{" "}
          {data?.volunteers?.length >= data?.max ||
          (data?.additional === "allowMeeting" && !data?.attendance[id]) ||
          (data?.additional === "allowAll" && isMember === false) ? (
            ""
          ) : (
            <span className={style.icon}>→</span>
          )}
        </button>
      </form>
      <br></br>
      <small style={{ fontFamily: "var(--manrope-font)" }}>
        *Applying as a volunteer may redirect you to a registration form outside
        of NoteSwap.
      </small>
    </Modal>
  );
}
