const getAllTicketsButton = document.getElementById("get-all-tickets-button");

getAllTicketsButton.addEventListener("click", (e) => {
  fetch("/ticket/all")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      fillTicketData(data);
    });
});

const filterForm = document.getElementById("filter-form");

//filter the tickets
filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const status = document.getElementById("status").value;
  const priorityLevel = document.getElementById("priority-level").value;
  const department = document.getElementById("department").value;

  fetch(
    `/ticket/all?status=${status}&priorityLevel=${priorityLevel}&department=${department}`,
    {
      method: "get",
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      fillTicketData(data);
      console.log(data);
    });
  console.log(status, priorityLevel, department);
});

//function to fill the ticket data in the UI
function fillTicketData(data) {
  const ticketDataContainer = document.getElementById("ticket-data");
  const departmentSelect = document.getElementById("department");
  const ticketTableBody = document.getElementById("ticket-table-body");

  ticketDataContainer.classList.remove("ticket-data");

  //filling the department select
  departmentSelect.innerHTML = "";
  departmentSelect.innerHTML = `<option value="" ><option>`;
  data.departments.forEach((department) => {
    departmentSelect.innerHTML += `<option value="${department}">${department}</option>`;
  });

  // filling the ticket table body.
  ticketTableBody.innerHTML = "";

  data.tickets.forEach((ticket) => {
    ticketTableBody.innerHTML += `<tr>
         <th scope="row">${ticket._id}</th>
         <td>${ticket.createdBy}</td>
         <td>${ticket.title}</td>
         <td>${ticket.description}</td>
         <td>${ticket.assignedTo}</td>
         <td>${ticket.status}</td>
         <td>
         <span class="priority-label priority-${ticket.priorityLevel}">${ticket.priorityLevel}</span>
         </td>
         <td><a
         href="/chat?ticketId=${ticket._id}"
         ticket-id="${ticket._id}"
         type="button"
         id="chat-button"
         class="chat-btn"
         target="_blank"
       >
         Chat
       </a></td>

       </tr>`;
  });
}

// department insertion code
// <% departments.forEach(department=> { %>
//   <option value="<%=department%>"><%=department%></option>
//   <% }) %>

//table body insertion code
// <% tickets.forEach(ticket => { %>
//   <tr>
//     <th scope="row"><%=ticket._id%></th>
//     <td><%=ticket.createdBy%></td>
//     <td><%=ticket.title%></td>
//     <td><%=ticket.description%></td>
//     <td><%=ticket.assignedTo%></td>
//     <td><%=ticket.status%></td>
//     <td class="priority-<%=ticket.priorityLevel%>">
//       <%=ticket.priorityLevel%>
//     </td>
//   </tr>
//   <% }) %>

//pagination insertion code
// <% for( let i = 0; i < totalPages; i++ ) { %>
//   <li class="page-item">
//     <a class="page-link" href="/ticket/all?page=<%=i+1%>"><%=i+1%></a>
//   </li>
//   <% } %>
