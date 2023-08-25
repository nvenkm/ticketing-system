const socket = io();
const ticketIdElement = document.querySelector(".ticketId");
const ticketId = ticketIdElement.textContent;
console.log(ticketId);
// JavaScript code for handling messages and sending data goes here
const chatContainer = document.getElementById("chatContainer");
const messageInput = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");
const sendButton = document.getElementById("sendButton");
const messageForm = document.getElementById("message-form");
const sender = document.querySelector(".username").textContent;

socket.emit("join-room", ticketId);

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  const file = fileInput.files[0];
  // console.log(message, !file);
  const fd = new FormData();
  if (message !== "" || file) {
    fd.append("messageText", message);
    fd.append("file", fileInput.files[0]);
    fd.append("ticketId", ticketId);
    fd.append("sender", sender);
    fetch("chat/message", {
      method: "POST",
      body: fd,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        var file = data.file;
        socket.emit("chat-message", data);

        messageInput.value = "";
      });

    // console.log("FORM DATA:", fd);
    if (message !== "" || !file) {
      console.log(file);
    }
  }
});

socket.on("chat-message", (data) => {
  const messageSender = data.sentBy === sender ? "You:" : data.sentBy + ":";
  const messageElement = createMessageElement(
    messageSender,
    data.message,
    data.file
  );
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

function createMessageElement(name, message, file) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message ";

  const messageContent = file
    ? `
          <div class="name-message-container" >
          <span class="sender" >${name}</span>
          <p class="message-text" >${message}</p>
          <img src="${file}">
          </div>
        `
    : `
        <div class="name-message-container" >
        <span class="sender" >${name}</span>
        <p class="message-text" >${message}</p>
        </div>
      `;

  messageDiv.innerHTML = messageContent;
  return messageDiv;
}
