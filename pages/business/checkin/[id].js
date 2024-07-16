import BusinessSidebar from "../../../components/Layout/BusinessSidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QrScanner from "../../../components/Extra/Scanner";
import style from "../../../styles/Business.module.css";

function Checkin() {
  const router = useRouter();
  const [id, setId] = useState(null);

  useEffect(() => {
    const { query } = router;
    console.log(query);

    setId(query.id);
  }, [router]);
  return (
    <>
      <div className={style.container}>
        <BusinessSidebar />
        <QrScanner eventId={id} />
      </div>
    </>
  );
}

export default Checkin;
