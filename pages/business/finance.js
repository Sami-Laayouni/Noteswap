import BusinessSidebar from "../../components/Layout/BusinessSidebar";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const AddMembers = dynamic(() => import("../../components/Modals/AddMembers"));
import style from "../../styles/Business.module.css";
export default function Finance() {
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    async function fetchReferralLink() {
      const res = await fetch("/api/paypal/create_onboarding_link", {
        method: "POST",
      });
      const data = await res.json();
      console.log(data);
      setReferralLink(data.links[1].href); // The link to onboard
    }
    fetchReferralLink();
  }, []);
  return (
    <div className={style.container}>
      <BusinessSidebar />
      <AddMembers />
      <div>
        <h1 style={{ fontFamily: "var(--manrope-font)" }}>
          Onboard as an Event Organizer
        </h1>
        {referralLink && (
          <a href={referralLink} target="_blank" rel="noopener noreferrer">
            Complete Onboarding
          </a>
        )}
      </div>
    </div>
  );
}
