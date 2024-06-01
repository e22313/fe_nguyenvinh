document.addEventListener("DOMContentLoaded", function () {
  var roomRegisterForm = document.getElementById("roomRegisterForm");
  var popup = document.getElementById("popup");
  var popupMessage = document.getElementById("popupMessage");
  var logoutButton = document.getElementById("logoutButton");
  var welcomeMessage = document.getElementById("welcomeMessage");
  var groupSizeContainer = document.getElementById("groupSizeContainer");

  var loggedInUser = localStorage.getItem("username");
  console.log(loggedInUser);
  if (loggedInUser) {
    welcomeMessage.textContent = `Xin chào, ${loggedInUser}`;
  }

  var purposeSelect = document.getElementById("purpose");
  purposeSelect.addEventListener("change", function () {
    if (purposeSelect.value === "group_study") {
      groupSizeContainer.style.display = "block";
    } else {
      groupSizeContainer.style.display = "none";
    }
  });

  if (roomRegisterForm) {
    roomRegisterForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Ngăn chặn form gửi đi

      var purpose = document.getElementById("purpose").value;
      var groupSize = document.getElementById("groupSize").value;

      var requestData = {
        username: loggedInUser,
        classroom_type: purpose,
        group_size: groupSize,
      };

      // Update classroom_type based on group_size
      if (requestData.classroom_type === "group_study") {
        if (requestData.group_size >= 20) {
          requestData.classroom_type = "group_study_large";
        } else {
          requestData.classroom_type = "group_study_small";
        }
      }

      fetch("https://nguyenvinh.onrender.com/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            var roomNumber = data.message;

            var message = "";
            switch (purpose) {
              case "self_study":
                message = `Đăng kí lớp học thành công. Bạn được chỉ định vào phòng ${roomNumber} cho mục đích tự học.`;
                break;
              case "group_study":
                message = `Đăng kí lớp học thành công. Bạn được chỉ định vào phòng ${roomNumber} cho học nhóm với ${groupSize} thành viên.`;
                break;
              case "rehearsal":
                message = `Đăng kí lớp học thành công. Bạn được chỉ định vào phòng ${roomNumber} cho diễn tập.`;
                break;
              default:
                message = "Đăng kí thất bại. Vui lòng thử lại.";
            }
            showPopup(message, false);
          } else if (data.status === 404) {
            showPopup(data.message, true);
          } else {
            showPopup(data.message, true);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showPopup("Đăng kí thất bại. Vui lòng thử lại.", true);
        });
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("username");
      window.location.href = "../index.html";
    });
  }

  function showPopup(message, isError) {
    popupMessage.textContent = message;
    if (isError) {
      popup.classList.add("popup-error");
    } else {
      popup.classList.remove("popup-error");
    }
    popup.style.display = "block";

    // Tự động ẩn popup sau 3 giây
    setTimeout(function () {
      popup.style.display = "none";
    }, 3000);
  }
});
