import style from "./discoverCard.module.css";

function EventCard({ event, onSwipeLeft, onSwipeRight }) {
  return (
    <div className={style.eventCard}>
      <img src={event.imageUrl} alt={event.name} className={style.eventImage} />
      <div className={style.eventContent}>
        <h2>{event.name}</h2>
        <p>{event.description}</p>
        <p className={style.eventDate}>Date: {event.date}</p>
        <p className={style.eventLocation}>Location: {event.location}</p>
        <div className={style.eventActions}>
          <button onClick={onSwipeLeft} className={style.actionBtn}>
            Sign Up
          </button>
          <button onClick={onSwipeRight} className={style.actionBtn}>
            Volunteer
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
