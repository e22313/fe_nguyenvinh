document.addEventListener("DOMContentLoaded", function () {
  var roomsBody = document.getElementById("roomsBody");
  var popup = document.getElementById("popup");
  var popupMessage = document.getElementById("popupMessage");

  var loggedInUser = localStorage.getItem("username");
  console.log(loggedInUser);
  if (loggedInUser) {
    welcomeMessage.textContent = `Xin chào, ${loggedInUser}`;
  }

  // Make an HTTP request to fetch room data from the API
  fetch("https://nguyenvinh.onrender.com/api/room")
    .then((response) => response.json())
    .then((data) => {
      displayRooms(data); // Display rooms when data is fetched
    })
    .catch((error) => {
      console.error("Error fetching room data:", error);
    });

  function displayRooms(roomsData) {
    roomsData.forEach(function (room) {
      var roomRow = createRoomRow(room);
      roomsBody.appendChild(roomRow);
    });
  }

  function createRoomRow(room) {
    var roomRow = document.createElement("tr");
    roomRow.innerHTML = `
        <td>${room.roomName}</td>
        <td>${room.capacity}</td>
        <td>${room.size}</td>
        <td>${room.registeredCount}</td>
        <td class="${room.status ? "available" : "not-available"}">${
      room.status ? "AVAILABLE" : "NOT AVAILABLE"
    }</td>
      `;
    roomRow.addEventListener("click", function () {
      toggleRoomStatus(room, roomRow);
    });
    return roomRow;
  }

  function toggleRoomStatus(room, roomRow) {
    room.status = !room.status;
    var statusText = room.status ? "AVAILABLE" : "NOT AVAILABLE";
    var statusClass = room.status ? "available" : "not-available";
    roomRow.querySelector("td:last-child").textContent = statusText;
    roomRow.querySelector("td:last-child").className = statusClass;
    updateRoomStatus(room.room_id, room.status);
    showPopup(`${room.roomName} is now ${statusText.toLowerCase()}.`, false);
  }

  function updateRoomStatus(roomId, newStatus) {
    fetch(`https://nguyenvinh.onrender.com/api/room`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_id: roomId,
        status: newStatus,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update room status");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Room status updated successfully:", data);
        showPopup("Update successful!", false);
      })
      .catch((error) => {
        console.error("Error updating room status:", error);
        showPopup("Failed to update room status", true);
      });
  }

  function showPopup(message, isError) {
    popupMessage.textContent = message;
    popup.classList.toggle("popup-error", isError);
    popup.style.display = "block";
    setTimeout(function () {
      popup.style.display = "none";
    }, 3000);
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("username");
      window.location.href = "../index.html";
    });
  }

  // Initial setup
  if (roomsBody) {
    // Display rooms will be triggered after fetching data from the API
  }
});
