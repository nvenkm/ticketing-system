const closeTicketButtons = document.querySelectorAll("#close-ticket-button");

console.log(closeTicketButtons);

closeTicketButtons.forEach((closeTicketButton) => {
  closeTicketButton.addEventListener("click", function (e) {
    const id = e.target.getAttribute("ticket-id");
    console.log(id);
    fetch(`/ticket/close/${id}`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
