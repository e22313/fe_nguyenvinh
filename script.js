function setCookie(cookieName, cookieValue, expirationDays) {
  var d = new Date();
  d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}
$(document).ready(function () {
  var loginForm = $("#loginForm");

  if (loginForm.length) {
    loginForm.on("submit", function (event) {
      event.preventDefault(); // Ngăn chặn form gửi đi

      var username = $("#username").val();
      var password = $("#password").val();

      // Gọi API đăng nhập
      $.ajax({
        url: "https://nguyenvinh.onrender.com/api/auth/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          username: username,
          password: password,
        }),
        success: function (response) {
          console.log(response);

          showPopup("Login successful!", false);
          // let userName = response.userName; // Giả sử response có thuộc tính userName
          let role = response.user_type; // Giả sử response có thuộc tính role
          // Lưu username vào local storage
          localStorage.setItem("username", username);
          if (role === 1) {
            window.location.href = "../screen/dashboard_teacher.html";
          } else {
            window.location.href = "../screen/dashboard_student.html";
          }

          // Lưu sessionId vào cookie
          setCookie("sessionId", response.sessionId, 7); // Lưu trong 7 ngày
          // Chuyển hướng qua trang khác sau khi đăng nhập thành công
          // window.location.href = "../screen/dashboard_student.html";
        },
        error: function (xhr, status, error) {
          // Xử lý lỗi khi gọi API không thành công
          console.error(status, error);
          showPopup("Login failed. Please try again later.", true);
        },
      });
    });
  }
});

function showPopup(message, isError) {
  var popup = $("#popup");
  var popupMessage = $("#popupMessage");

  popupMessage.text(message);
  if (isError) {
    popup.addClass("popup-error");
  } else {
    popup.removeClass("popup-error");
  }
  popup.css("display", "block");

  // Tự động ẩn popup sau 3 giây
  setTimeout(function () {
    popup.css("display", "none");
  }, 3000);
}
