document.addEventListener("DOMContentLoaded", function () {
  var roomsBody = document.getElementById("roomsBody");
  var popup = document.getElementById("popup");
  var popupMessage = document.getElementById("popupMessage");
  var clearButton = document.getElementById("clearButton");
  var loggedInUser = localStorage.getItem("username");

  // Hàm để hiển thị các phòng
  function displayRooms(roomsData) {
    roomsBody.innerHTML = ""; // Xóa bỏ các phòng hiện tại
    roomsData.forEach(function (room) {
      var roomRow = createRoomRow(room);
      roomsBody.appendChild(roomRow);
    });
  }

  // Hàm để tạo một hàng phòng
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
    roomRow.addEventListener("click", function (event) {
      if (event.target.tagName !== "BUTTON") {
        toggleRoomStatus(room, roomRow);
      }
    });
    return roomRow;
  }

  // Hàm để cập nhật trạng thái phòng
  function toggleRoomStatus(room, roomRow) {
    room.status = !room.status;
    var statusText = room.status ? "AVAILABLE" : "NOT AVAILABLE";
    var statusClass = room.status ? "available" : "not-available";
    var statusCell = roomRow.querySelector("td:nth-last-child(1)"); // Lấy ô dữ liệu trạng thái
    statusCell.textContent = statusText; // Cập nhật văn bản trạng thái
    statusCell.className = statusClass; // Cập nhật lớp trạng thái
    updateRoomStatus(room.roomId, room.status);
  }

  // Hàm để cập nhật trạng thái phòng trên máy chủ
  function updateRoomStatus(roomId, newStatus) {
    const updateData = {
      room_id: roomId,
      status: newStatus,
    };

    fetch(`https://nguyenvinh.onrender.com/api/room`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update room status");
        }
        showPopup("Update successful!", false);
        return response.json();
      })
      .catch((error) => {
        console.error("Error updating room status:", error);
        showPopup("Failed to update room status", true);
      });
  }

  // Hàm để xóa tất cả các phòng
  function deleteRoom() {
    fetch(`https://nguyenvinh.onrender.com/api/room`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete rooms");
        }
        return response.json();
      })
      .then(() => {
        showPopup("All rooms have been reset.", false);
        fetchRoomData(); // Gọi hàm để tải lại dữ liệu phòng mới
      })
      .catch((error) => {
        console.error("Error deleting rooms:", error);
        showPopup("Failed to reset rooms", true);
      });
  }

  // Hàm để tải lại dữ liệu phòng
  function fetchRoomData() {
    fetch("https://nguyenvinh.onrender.com/api/room")
      .then((response) => response.json())
      .then((data) => {
        displayRooms(data); // Hiển thị các phòng mới
      })
      .catch((error) => {
        console.error("Error fetching room data:", error);
        showPopup("Failed to fetch room data", true);
      });
  }

  // Sự kiện click của nút clear
  clearButton.addEventListener("click", function () {
    deleteRoom(); // Xóa tất cả các phòng
  });

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("username");
      window.location.href = "../index.html";
    });
  }

  // Hàm hiển thị thông báo popup
  function showPopup(message, isError) {
    popupMessage.textContent = message;
    popup.classList.toggle("popup-error", isError);
    popup.style.display = "block";
    setTimeout(function () {
      popup.style.display = "none";
    }, 3000);
  }

  // Khi DOM đã được tải, tải dữ liệu phòng
  fetchRoomData();
});
