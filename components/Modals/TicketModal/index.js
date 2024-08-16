import { useContext, useState, useEffect } from "react";
import ModalContext from "../../../context/ModalContext";
import Modal from "../../Template/Modal";
import { useRouter } from "next/router";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import style from "./ticketModal.module.css";
function Message({ content }) {
  return <p>{content}</p>;
}

export default function TicketModal() {
  const { ticketModal, eventData } = useContext(ModalContext);
  const [open, setOpen] = ticketModal;
  const [data] = eventData;
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketsPrice, setTicketsPrice] = useState(0);
  const [purchasedTicketsCount, setPurchasedTicketsCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const [ticketCounts, setTicketCounts] = useState({});
  const [purchasedTickets, setPurchasedTickets] = useState({});
  const [maxReached, setMaxReached] = useState({});
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const initialCounts = {};
    const initialPurchased = {};
    const maxReachedState = {};

    data?.tickets?.forEach((ticket) => {
      const purchasedCount =
        data.purchasedTickets
          ?.filter((pt) => pt.ticketId === ticket.id)
          .reduce((sum, _) => sum + 1, 0) || 0;

      initialCounts[ticket.id] = 0;
      initialPurchased[ticket.id] = purchasedCount;
      maxReachedState[ticket.id] = purchasedCount >= ticket.max;
    });

    setTicketCounts(initialCounts);
    setPurchasedTickets(initialPurchased);
    setMaxReached(maxReachedState);

    console.log("Purchased Tickets:", initialPurchased);
  }, [data]);

  const updateTicketCount = (id, increment) => {
    const newCounts = { ...ticketCounts };
    const currentCount = newCounts[id] || 0;
    const purchasedCount = purchasedTickets[id] || 0;
    const ticketMax = data.tickets.find((ticket) => ticket.id === id).max;

    const potentialNewCount = increment
      ? currentCount + 1
      : Math.max(currentCount - 1, 0);

    if (potentialNewCount + purchasedCount > ticketMax && increment) {
      setMaxReached((prevState) => ({ ...prevState, [id]: true }));
      return;
    }

    setMaxReached((prevState) => ({ ...prevState, [id]: false }));
    newCounts[id] = potentialNewCount;
    setTicketCounts(newCounts);
    updateTotalPrice(newCounts);
  };

  const updateTotalPrice = (counts) => {
    const newTotalPrice = data?.tickets.reduce(
      (acc, ticket) => {
        const count = counts[ticket.id] || 0;
        return {
          cost: acc.cost + count * ticket.price,
          count: acc.count + count,
        };
      },
      { cost: 0, count: 0 }
    );
    setPurchasedTicketsCount(newTotalPrice.count);
    const paypalFee = newTotalPrice.cost * 0.065 + 3; // PayPal fee calculation
    const commissionFee = newTotalPrice.count * 10; // Commission fee calculation
    const finalPrice = newTotalPrice.cost + paypalFee + commissionFee;
    console.log(finalPrice, newTotalPrice.cost, paypalFee, commissionFee);
    setTicketsPrice(newTotalPrice.cost);
    setTotalPrice(finalPrice);
  };

  const handlePurchase = async () => {
    setCurrent(1);
  };

  const paypalCreateOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/paypal/create_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          purchasedBy: JSON.parse(localStorage.getItem("userInfo"))._id,
          eventId: data?._id,
          totalCosts: totalPrice,
          tickets: data?.tickets
            .map((ticket) => ({
              id: ticket.id,
              name: ticket.name,
              quantity: ticketCounts[ticket.id] || 0,
            }))
            .filter((ticket) => ticket.quantity > 0),
        }),
      });
      const info = await response.json();
      console.log(info);
      return info.data.order.id; // Adjust according to the actual API response
    } catch (err) {
      alert(err);
      console.error("Error creating PayPal order:", err);
      return null;
    }
  };

  const paypalCaptureOrder = async (orderID) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/paypal/capture_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderID,
          user_id: JSON.parse(localStorage.getItem("userInfo"))._id, // should be dynamically set
          order_price: totalPrice, // updated to use the totalPrice state
          purchasedBy: JSON.parse(localStorage.getItem("userInfo"))._id,
          eventId: data?._id,
          eventName: data?.title,
          purchasedEmail: data?.contact_email,
          date_of_event: data?.date_of_events,
          location: data?.location,
          locationName: data?.locationName,
          totalCosts: totalPrice,
          tickets: data?.tickets
            .map((ticket) => ({
              id: ticket.id,
              name: ticket.name,
              quantity: ticketCounts[ticket.id] || 0,
            }))
            .filter((ticket) => ticket.quantity > 0),
        }),
      });
      const info = await response.json();
      if (info.success) {
        setMessage("Payment successful!");
        router.push("/tickets");
        setOpen(false);
      } else {
        setMessage("Payment failed: " + info.message);
      }
    } catch (error) {
      setMessage("Error processing payment: " + error.message);
    }
  };

  if (!data || !data.tickets || !ticketCounts) return null;

  if (!open) {
    return null;
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title={"Purchase Tickets Before They Sell Out!"}
      small={true}
    >
      <div className={current === 0 ? style.large : style.small}>
        {current == 0 && (
          <>
            {data?.tickets?.map((ticket) => (
              <div
                key={ticket.id}
                style={{
                  padding: "15px",
                  width: "100%",
                  border: "1px solid var(--accent-color)",
                  marginTop: "25px",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "75% 25%",
                }}
              >
                {ticket.name} ({ticket.price} {ticket.currency}) - Max:{" "}
                {ticket.max}
                {maxReached[ticket.id] && ticketCounts[ticket.id] === 0 ? (
                  <div style={{ color: "red", textAlign: "center" }}>
                    Sold Out
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      style={buttonStyle}
                      onClick={() => updateTicketCount(ticket.id, false)}
                    >
                      -
                    </button>
                    <div style={{ display: "inline-block" }}>
                      {ticketCounts[ticket.id] || 0}
                    </div>
                    <button
                      style={buttonStyle}
                      onClick={() => updateTicketCount(ticket.id, true)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
            {ticketsPrice != 0 && (
              <>
                <div style={{ marginTop: "20px" }}>
                  <p>Tickets Cost: {ticketsPrice.toFixed(2)} MAD</p>
                  <p>
                    Transaction Fee: {(ticketsPrice * 0.065 + 3).toFixed(2)} MAD
                  </p>
                  <p>
                    Service Fee: {(purchasedTicketsCount * 10).toFixed(2)} MAD
                  </p>
                  Total: {totalPrice.toFixed(2)} MAD
                  <button
                    style={{
                      display: "block",
                      padding: "12px",
                      margin: "10px 0",
                      backgroundColor: "var(--accent-color)",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                    type="button"
                    onClick={() => {
                      handlePurchase();
                    }}
                    disabled={totalPrice <= 0}
                  >
                    Continue to Purchase
                  </button>
                  <div style={{ marginTop: "20px" }}>
                    <strong>Refund Policy:</strong> You can be refunded until
                    the start of the concert.
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {current == 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <div style={{ paddingTop: "40px" }}>
              <p style={{ fontFamily: "var(--manrope-font)" }}>
                Due to security reasons, we use PayPal&apos;s secure payment
                methods; therefore, all payments are completed in USD. However,
                don&apos;t worry—we handle this transaction for you, and the fee
                is already included.{" "}
              </p>
              <div>
                <PayPalScriptProvider
                  options={{
                    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
                    style={{
                      color: "gold",
                      shape: "rect",
                      label: "pay",
                      height: 50,
                    }}
                    createOrder={async (data, actions) => {
                      const order_id = await paypalCreateOrder();
                      return order_id + "";
                    }}
                    onApprove={async (data, actions) => {
                      const response = await paypalCaptureOrder(data.orderID);
                      if (response) return true;
                    }}
                    onError={(e) => {
                      console.log(e);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
              <Message content={message} />
            </div>
            <p
              style={{
                fontFamily: "var(--manrope-font)",
                cursor: "pointer",
                paddingLeft: "20px",
              }}
              onClick={() => {
                setCurrent(0);
              }}
            >
              Back
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

const buttonStyle = {
  display: "inline-block",
  cursor: "pointer",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  border: "none",
  outline: "none",
  background: "var(--accent-color)",
  color: "white",
  fontSize: "1.3rem",
  margin: "0 10px",
};
