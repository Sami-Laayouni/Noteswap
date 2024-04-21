import { useState, useContext, useEffect } from "react";
import ModalContext from "../../../context/ModalContext";
import Modal from "../../Template/Modal";
import style from "./addMembers.module.css";

function AddMembers() {
  const { addMembers } = useContext(ModalContext);
  const [open, setOpen] = addMembers;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [role, setRole] = useState("");
  const [extraRole, setExtraRole] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`/api/association/search?query=${query}`);
        const data = await response.json();
        setResults(data.members || []);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        setResults([]);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleAddMember = async () => {
    if (!selectedMember || !role) return;
    try {
      await fetch("/api/association/addmember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: selectedMember._id,
          associationId: JSON.parse(localStorage.getItem("associationInfo"))
            ._id,
          role: role,
          extra: extraRole,
        }),
      });
      // Handle success (clear form, notify user, etc.)
      setSelectedMember(null);
      setRole("");
      setMessage("Successfully added member");
      setQuery("");
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Add Members to Your Association"
    >
      <input
        type="text"
        placeholder="Search members"
        value={query}
        className={style.input}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul className={style.list}>
          {results.map((member) => (
            <li
              key={member._id}
              onClick={() => {
                setSelectedMember(member);
              }}
            >
              <img
                src={member.profile_picture}
                alt="Profile Picture"
                width={45}
                height={45}
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  display: "inline-block",
                  verticalAlign: "middle",
                  borderRadius: "50%",
                }}
              />
              <p
                style={{
                  display: "inline",
                  paddingLeft: "10px",
                }}
              >
                {" "}
                {member.first_name} {member.last_name}
              </p>
            </li>
          ))}
        </ul>
      )}
      {selectedMember && (
        <div>
          <p>
            Selected: {selectedMember.first_name} {selectedMember.last_name}
          </p>
          <p style={{ display: "inline-block" }}>Select A Role:</p>
          <select
            style={{
              display: "inline-block",
              marginLeft: "10px",
              padding: "10px",
              border: "1px solid var(--accent-color)",
              borderRadius: "6px",
            }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="member">Member</option>
            <option value="board_member">Board Member</option>
          </select>
          {role == "board_member" && (
            <input
              className={style.input}
              style={{
                display: "inline-block",
                height: "38px",
                width: "300px",
                marginLeft: "10px",
              }}
              value={extraRole}
              onChange={(e) => {
                setExtraRole(e.target.value);
              }}
              placeholder="Title (ie: President)"
            />
          )}
          <button
            className={style.button}
            onClick={handleAddMember}
            disabled={!role}
          >
            Add Member
          </button>
        </div>
      )}
      <p>{message}</p>
    </Modal>
  );
}

export default AddMembers;
