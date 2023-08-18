const closeTicketButtons = document.querySelectorAll("#close-ticket-button");
closeTicketButtons.forEach((closeTicketButton) => {
  closeTicketButton.addEventListener("click", function (e) {
    const id = e.target.getAttribute("ticket-id");
    console.log(id);
    fetch(`/ticket/close/${id}`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/ticket";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
