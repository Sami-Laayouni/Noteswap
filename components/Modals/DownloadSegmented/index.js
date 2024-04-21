import Modal from "../../Template/Modal";
import { useContext, useState } from "react";
import ModalContext from "../../../context/ModalContext";
import style from "./downloadSegmented.module.css";

function DownloadSegmented() {
  const { downloadSegmented, signedUpVolunteers } = useContext(ModalContext);
  const [open, setOpen] = downloadSegmented;
  const [data] = signedUpVolunteers;
  const [newMembersPercentage, setNewMembersPercentage] = useState(30);
  const [oldMembersPercentage, setOldMembersPercentage] = useState(40);
  const [boardMembersPercentage, setBoardMembersPercentage] = useState(30);
  const [volunteers, setVolunteers] = useState(40);

  // Function to calculate the total percentage and update the state accordingly
  const updatePercentage = (setter, value) => {
    const percentage = Math.min(100, Math.max(0, value));
    setter(percentage);
  };

  // Function to handle input changes and enforce total percentage logic
  const handlePercentageChange = (type, value) => {
    const numericValue = parseFloat(value);
    switch (type) {
      case "new":
        updatePercentage(setNewMembersPercentage, numericValue);
        break;
      case "old":
        updatePercentage(setOldMembersPercentage, numericValue);
        break;
      case "board":
        updatePercentage(setBoardMembersPercentage, numericValue);
        break;
      default:
        break;
    }
  };

  async function downloadDataAsExcel(volunteersData) {
    const modifiedData = volunteersData.map((volunteer) => {
      const id = volunteer.userId;
      const datas = data.find((item) => item._id == id);
      const { first_name, last_name, points, tutor_hours, email } = datas;
      const totalPoints =
        Math.floor(points / 20) + Math.floor(tutor_hours / 60);
      const fixed_first_name =
        first_name.charAt(0).toUpperCase() + first_name.slice(1);
      const fixed_last_name =
        last_name.charAt(0).toUpperCase() + last_name.slice(1);
      const formattedTotalPoints = `${totalPoints} minute${
        totalPoints === 1 ? "" : "s"
      }`;

      // Include other volunteer properties as needed
      return {
        "First Name": fixed_first_name,
        "Last Name": fixed_last_name,
        Email: email,
        "Total Community Service Earned": formattedTotalPoints,
        "Reason Selected": volunteer.type,
      };
    });

    // Convert the modified data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(modifiedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Volunteers");

    // Generate a buffer to store the data
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Create a Blob from the buffer
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create an anchor element and dispatch a click event to trigger the download
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Volunteer_Data.xlsx";
    anchor.click();

    // Cleanup: revoke the object URL after use
    URL.revokeObjectURL(url);
  }

  async function fetchAssociationMembers() {
    const members = await fetch("/api/association/get_members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        associationId: JSON.parse(localStorage.getItem("associationInfo"))._id,
      }),
    });
    const memo = await members.json();
    return memo.members;
  }

  async function segmentUsers(volunteers, totalCount, percentages) {
    const {
      newMembers: newPercent,
      oldMembers: oldPercent,
      boardMembers: boardPercent,
    } = percentages;

    // Fetching detailed association member data
    const associationMembers = await fetchAssociationMembers();

    // Map volunteers to detailed member info
    const detailedVolunteers = volunteers
      .map((volunteer) =>
        associationMembers.find((member) => member.userId === volunteer._id)
      )
      .filter((member) => member); // Filter to eliminate undefined entries if no match found

    // Calculate current date to determine new vs old members
    const currentDate = new Date();
    const oneYearAgo = new Date(
      currentDate.setFullYear(currentDate.getFullYear() - 1)
    );

    // Categorize members
    const newMembers = detailedVolunteers
      .filter((member) => new Date(member.date) > oneYearAgo)
      .map((member) => ({ ...member, type: "New Member" })); // Append type
    const oldMembers = detailedVolunteers
      .filter((member) => new Date(member.date) <= oneYearAgo)
      .map((member) => ({ ...member, type: "Old Member" })); // Append type
    const boardMembers = detailedVolunteers
      .filter((member) => member.role === "board_member")
      .map((member) => ({ ...member, type: "Board Member" })); // Append type

    // Calculate how many to select from each category
    const countNew = Math.floor((totalCount * newPercent) / 100);
    const countOld = Math.floor((totalCount * oldPercent) / 100);
    const countBoard = Math.floor((totalCount * boardPercent) / 100);

    // Set to track selected user IDs to avoid duplicates
    const selectedUserIds = new Set();

    // Function to select members while ensuring no duplicates across categories
    function selectMembers(members, count) {
      const selected = [];
      for (const member of members) {
        if (selected.length >= count) break;
        if (!selectedUserIds.has(member.userId)) {
          selected.push(member);
          selectedUserIds.add(member.userId);
        }
      }
      return selected;
    }

    // Select the specified number from each category
    const selectedNewMembers = selectMembers(newMembers, countNew);
    const selectedOldMembers = selectMembers(oldMembers, countOld);
    const selectedBoardMembers = selectMembers(boardMembers, countBoard);

    // Combine selected members
    const selectedMembers = [
      ...selectedNewMembers,
      ...selectedOldMembers,
      ...selectedBoardMembers,
    ];
    downloadDataAsExcel(selectedMembers);
    return selectedMembers;
  }

  // Check total percentage
  const totalPercentage =
    parseFloat(newMembersPercentage) +
    parseFloat(oldMembersPercentage) +
    parseFloat(boardMembersPercentage);

  return (
    <Modal
      onClose={() => {
        setOpen(false);
      }}
      title={"Download Segmented Data"}
      isOpen={open}
    >
      <div>
        <label className={style.labelForInput}>% New Members:</label>

        <input
          type="number"
          value={newMembersPercentage}
          onChange={(e) => handlePercentageChange("new", e.target.value)}
          max="100"
          className={style.input}
        />
      </div>
      <div>
        <label className={style.labelForInput}>% Old Members: </label>

        <input
          type="number"
          value={oldMembersPercentage}
          onChange={(e) => handlePercentageChange("old", e.target.value)}
          max="100"
          className={style.input}
        />
      </div>
      <div>
        <label className={style.labelForInput}>% Board Members: </label>

        <input
          type="number"
          value={boardMembersPercentage}
          onChange={(e) => handlePercentageChange("board", e.target.value)}
          max="100"
          className={style.input}
        />
      </div>
      <div>
        <label className={style.labelForInput}>
          Number of volunteers to select
        </label>

        <input
          type="number"
          value={volunteers}
          onChange={(e) => setVolunteers(e.target.value)}
          className={style.input}
        />
      </div>
      {totalPercentage > 100 && (
        <p style={{ color: "red" }}>
          The total percentage cannot exceed 100%. Adjust the values
          accordingly.
        </p>
      )}

      <button
        className={style.button}
        onClick={() => {
          segmentUsers(data, volunteers, {
            newMembers: newMembersPercentage,
            oldMembers: oldMembersPercentage,
            boardMembers: boardMembersPercentage,
          });
        }}
        disabled={
          newMembersPercentage +
            oldMembersPercentage +
            boardMembersPercentage !=
          100
        }
      >
        Download Segmented Data{" "}
      </button>
    </Modal>
  );
}

export default DownloadSegmented;
