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
  
      const username = $('#username').val();
      const password = $('#password').val();
  
      fetch('http://localhost:5000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Login successfully');
          window.location.href = 'orderlist.html';
        } else {
          alert('Invalid username or password');
        }
      })
      .catch(error => {
        alert('Error: ' + error);
      });
    });
  });
  