import { useContext, useState, useEffect } from "react";
import ModalContext from "../../../context/ModalContext";
import Modal from "../../Template/Modal";
import { useRouter } from "next/router";

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
  const [paypalFee, setPaypalFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
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
          cost: acc.cost + count * ticket.price || 0,
          count: acc.count + count,
        };
      },
      { cost: 0, count: 0 }
    );
    setPurchasedTicketsCount(newTotalPrice.count);

    const commissionFee =
      newTotalPrice.count * 10 + (2 / 100) * newTotalPrice.cost;
    const amount = (100 / 94) * (newTotalPrice.cost + commissionFee + 3);

    const finalPrice = amount;

    setTicketsPrice(newTotalPrice.cost);
    setTotalPrice(finalPrice);
    setPaypalFee(((6 / 100) * finalPrice + 3).toFixed(2));
    setServiceFee(commissionFee);
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
      return info.data.order; // Adjust according to the actual API response
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

  const freeTicket = async (orderID) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/tickets/free_tickets", {
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

  // Function to create an order
  async function createOrder() {
    const order_id = await paypalCreateOrder();
    console.log(order_id);
    return order_id + "";
  }

  // Function to handle approval of the payment
  async function onApprove(data) {
    const response = await paypalCaptureOrder(data.orderID);
    if (data) return true;
  }

  // Function to handle errors during the payment process
  function onError(e) {
    console.error("Payment error:", e);
  }

  function generateRandomId(length = 8) {
    return Math.random().toString(36).substr(2, length);
  }
  async function continueTicket() {
    await freeTicket(generateRandomId());
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
            {purchasedTicketsCount != 0 && (
              <>
                {ticketsPrice != 0 && (
                  <div>
                    <div style={{ marginTop: "20px" }}>
                      <p>Tickets Cost: {ticketsPrice.toFixed(2)} MAD</p>
                      <p>Transaction Fee: {paypalFee} MAD</p>
                      <p>Service Fee: {serviceFee.toFixed(2)} MAD</p>
                      Total: {totalPrice.toFixed(2)} MAD
                    </div>
                  </div>
                )}
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
                    if (ticketsPrice == 0) {
                      continueTicket();
                    } else {
                      handlePurchase();
                    }
                  }}
                  disabled={totalPrice <= 0}
                >
                  {ticketsPrice != 0 ? "Continue to Purchase" : "Continue"}
                </button>
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
                Due to security reasons, we use Square&apos;s secure payment
                methods.
              </p>
              {/*
              <PaymentForm
                applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID}
                locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID}
                cardTokenizeResponseReceived={async (tokenStuff) => {
                  try {
                    console.log(tokenStuff);
                    const token = localStorage.getItem("token");

                    const response = await fetch("/api/payment/submitPayment", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        sourceId: tokenStuff.token,
                        orderID: generateRandomId(),
                        purchasedBy: JSON.parse(
                          localStorage.getItem("userInfo")
                        )._id, // should be dynamically set
                        eventId: data?._id,
                        eventName: data?.title,
                        purchasedEmail: data?.contact_email,
                        date_of_event: data?.date_of_events,
                        location: data?.location,
                        locationName: data?.locationName,
                        amount: totalPrice,
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

                  const result = await submitPayment(token.token);
                  console.log(result);
                }}
              >
                <CreditCard />
              </PaymentForm>
              */}

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
