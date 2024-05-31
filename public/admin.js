// $(document).ready(function () {
//   $("#loginForm").validate({
//     rules: {
//       username: "required",
//       password: "required"
//     },
//     messages: {
//       username: "Please enter your username",
//       password: "Please enter your password"
//     }
//   });


//   // $('#loginButton').click(function() {
//   //     var username = $('#username').val();
//   //     var password = $('#password').val();

//   //     $.post('/login', { username: username, password: password }, function(response) {
//   //         if (response.success) {
//   //             window.location.href = "orderlist.html";
//   //         } else {
//   //             alert('Invalid username or password');
//   //         }
//   //     });
//   // });


//   $('#loginForm').submit(function (e) {
//     e.preventDefault();
//     if (!$(this).valid()) {
//       alert('Fill all the fields!');
//       return;
//     }
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', 'http://your-api-domain.com/data', true);
//     xhr.withCredentials = true;
//     xhr.onload = function () {
//       if (xhr.status === 200) {
//         console.log(xhr.responseText);
//       }
//     };
//     xhr.send();
    

//     $.ajax({
//       url: 'http://localhost:5000/login',
//       type: 'POST',
//       data: {
//         username: $('#username').val(),
//         password: $('#password').val()
//       },
//       success: function (response) {
//         console.log('success');
//         alert(response.data);
//         window.location.href = 'orderlist.html';
//       },
//       error: function (xhr) {
//         alert(xhr.responseText);
//       }
//     });
//   });


// });


$(document).ready(function () {
  $("#loginForm").validate({
    rules: {
      username: "required",
      password: "required"
    },
    messages: {
      username: "Please enter your username",
      password: "Please enter your password"
    }
  });

  $('#loginForm').submit(function (e) {
    e.preventDefault();
    if (!$(this).valid()) {
      alert('Fill all the fields!');
      return;
    }

    $.ajax({
      url: 'http://localhost:5000/login',
      type: 'POST',
      data: {
        username: $('#username').val(),
        password: $('#password').val()
      },
      xhrFields: {
        withCredentials: true
      },
      success: function (response) {
        console.log('success');
        //alert(response.data);
          alert("login successfully")
        window.location.href = 'orderlist.html';
      },
      error: function (xhr) {
        alert(xhr.responseText);
      }
    });
  });
});
