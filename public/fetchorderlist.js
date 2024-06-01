$(document).ready(function() {
    fetch('http://localhost:5000/orderList', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => {
      if (response.status === 401) {
        alert('You cannot access this page');
        window.location.href = 'admin.html'; // Redirect to login page
        throw new Error('Unauthorized access');
      }
      return response.json();
    })
    .then(data => {
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
    })
    .catch(error => {
      if (error.message !== 'Unauthorized access') {
        alert('Error fetching orders');
      }
    })
  });
  