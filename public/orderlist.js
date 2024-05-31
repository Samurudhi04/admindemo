$(document).ready(function() {
  $.ajax({
    url: 'http://localhost:5000/orderList',
    type: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: function (data) {
      let orderList = '';
      if (Array.isArray(data)) {
        data.forEach(order => {
          const date = new Date(order.orderDate);
          const formattedDate = date.toLocaleDateString('en-GB');
          orderList += `
            <tr>
              <td>${order.id}</td>
              <td>${formattedDate}</td>
              <td>${order.name}</td>
              <td>${order.email}</td>
              <td>${order.phone}</td>
              <td>${order.productName}</td>
              <td>${order.quantity}</td>
              <td>${order.comments}</td>
            </tr>
          `;
        });
      } else {
        alert('Received data is not an array');
      }
      $('#orderTableBody').html(orderList);
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        alert('You cannot access this page');
        window.location.href = 'admin.html'; // Redirect to login page
      } else {
        alert('Error fetching orders');
      }
    }
  });
});


// $(document).ready(function() {
//     $.ajax({
//           url: 'http://localhost:5000/orderList',
//           type: 'GET',
//           success: function (data) {
//             //console.log('Response data:', data);  // Log the response data
      
//             let orderList = '';
//             if (Array.isArray(data)) {
//               data.forEach(order => {
//                 const date = new Date(order.orderDate);
//                 const formattedDate = date.toLocaleDateString('en-GB');
//                 orderList += `
//                   <tr>
//                     <td>${order.id}</td>
//                     <td>${formattedDate}</td>
//                     <td>${order.name}</td>
//                     <td>${order.email}</td>
//                     <td>${order.phone}</td>
//                     <td>${order.productName}</td>
//                     <td>${order.quantity}</td>
//                     <td>${order.comments}</td>
//                   </tr>
//                 `;
//               });
//             } else {
//               alert('Received data is not an array');
//             }
//             $('#orderTableBody').html(orderList);
//           },
//           error: function (xhr) {
//             if (xhr.status === 401) {
//               alert('you cant acccess this page');
//               window.location.href = 'admin.html'; // Redirect to login page
//             } else {
//               alert('Error fetching orders');
//             }
//           }
//         });
// });