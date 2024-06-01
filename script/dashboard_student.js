document.addEventListener("DOMContentLoaded", function () {
  var roomRegisterForm = document.getElementById("roomRegisterForm");
  var popup = document.getElementById("popup");
  var popupMessage = document.getElementById("popupMessage");
  var logoutButton = document.getElementById("logoutButton");
  var welcomeMessage = document.getElementById("welcomeMessage");
  var groupSizeContainer = document.getElementById("groupSizeContainer");
  var isFormSubmitting = false; // Biến để kiểm tra trạng thái gửi biểu mẫu

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

      // Kiểm tra nếu biểu mẫu đã được gửi trước đó
      if (isFormSubmitting) {
        return;
      }

      // Đặt trạng thái gửi biểu mẫu là true để ngăn chặn gửi lặp lại
      isFormSubmitting = true;

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
                message = `Đăng kí lớp học thành công. Bạn được chỉ định vào phòng ${roomNumber} cho mục đích tự học. Vui lòng tắt quạt và điện khi ra khỏi phòng. Chung tay tiết kiệm điện vì một tương lai xanh. Mỗi kilowatt giờ tiết kiệm - Là một hành động bảo vệ môi trường.`;
                break;
              case "group_study":
                message = `Đăng kí lớp học thành công. Bạn được chỉ định vào phòng ${roomNumber} cho học nhóm với ${groupSize} thành viên. Vui lòng tắt quạt và điện khi ra khỏi phòng. Chung tay tiết kiệm điện vì một tương lai xanh. Mỗi kilowatt giờ tiết kiệm - Là một hành động bảo vệ môi trường.`;
                break;
              case "rehearsal":
                message = `Đăng kí lớp học thành công. Bạn được chỉ định vào phòng ${roomNumber} cho diễn tập. Vui lòng tắt quạt và điện khi ra khỏi phòng. Chung tay tiết kiệm điện vì một tương lai xanh. Mỗi kilowatt giờ tiết kiệm - Là một hành động bảo vệ môi trường.`;
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
        })
        .finally(() => {
          // Đặt trạng thái gửi biểu mẫu về false sau khi hoàn tất
          isFormSubmitting = false;
        });
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("username");
      window.location.href = "../index.html";
    });
  }

  // Hàm để hiển thị thông báo popup
  function showPopup(message, isError) {
    popupMessage.textContent = message;
    popup.classList.toggle("popup-error", isError);
    popup.style.display = "block";
    setTimeout(function () {
      popup.style.display = "none";
    }, 5000);
  }
});
