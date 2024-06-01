document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("registerForm");
  var popup = document.getElementById("popup");
  var popupMessage = document.getElementById("popupMessage");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn chặn form gửi đi

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var mssv = document.getElementById("mssv").value;
    var fullname = document.getElementById("fullname").value;

    // Tạo đối tượng chứa dữ liệu để gửi lên server
    var userData = {
      username: username,
      password: password,
      student_id: mssv,
      fullname: fullname,
    };

    // Gửi request POST đến API
    fetch("https://nguyenvinh.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        showPopup("Đăng kí thành công", false);
        form.reset();
      })
      .catch((error) => {
        // Xử lý lỗi
        showPopup("Đăng kí thất bại. username hoặc mssv đã tồn tại!", true);
        console.error("There was a problem with the fetch operation:", error);
      });
  });

  function showPopup(message, isError) {
    popupMessage.textContent = message;
    if (isError) {
      popup.classList.add("popup-error");
    } else {
      popup.classList.remove("popup-error");
    }
    popup.style.display = "block";
    setTimeout(function () {
      popup.style.display = "none";
    }, 4000);
  }
});
