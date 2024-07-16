// pages/index.js
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import DiscoverCard from "../components/Cards/DiscoverCard";
import LocationModal from "../components/Modals/LocationModal";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight") {
        setCurrentEventIndex((prev) => (prev + 1) % events.length);
      } else if (event.key === "ArrowLeft") {
        console.log("Left arrow key pressed");
        // Handle left arrow key
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  useEffect(() => {
    // Mock data; replace with your API call
    setEvents([
      {
        id: 1,
        name: "Local Concert",
        description: "Enjoy local bands",
        date: "2024-07-10",
        location: "Downtown Park",
        imageUrl:
          "https://t3.ftcdn.net/jpg/05/03/58/28/360_F_503582859_7SJMOrd2Xf5ujdBjrBCam7ngr9wc84vH.jpg",
      },
      {
        id: 2,
        name: "Tech Meetup",
        description: "Discuss the latest in tech",
        date: "2024-07-15",
        location: "Tech Hub",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrj7ZT_HORdzgfbsBmyxVDY7u30ecFJjx5Gw&s",
      },
    ]);
  }, []);

  const currentEvent = events[currentEventIndex];

  const handlers = useSwipeable({
    onSwipedLeft: () => console.log("Engage with event:", currentEvent),
    onSwipedRight: () =>
      setCurrentEventIndex((prev) => (prev + 1) % events.length),
  });

  if (!location) {
    return <LocationModal setLocation={setLocation} />;
  }

  return (
    <div
      {...handlers}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 70px)",
        backgroundColor: "whitesmoke",
        fontFamily: "var(--manrope-font)",
      }}
    >
      <p>Showing results for events in your area</p>
      {currentEvent ? (
        <DiscoverCard
          event={currentEvent}
          onSwipeLeft={() => console.log("Engage with event:", currentEvent)}
          onSwipeRight={() =>
            setCurrentEventIndex((prev) => (prev + 1) % events.length)
          }
        />
      ) : (
        <p>No more events to show.</p>
      )}
    </div>
  );
}
