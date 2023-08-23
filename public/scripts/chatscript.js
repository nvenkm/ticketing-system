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
  const message = messageInput.value;
  if (message.trim() !== "") {
    socket.emit("chat-message", { message, ticketId, sender });
  }
});

socket.on("chat-message", (data) => {
  const messageSender = data.sentBy === sender ? "You:" : data.sentBy + ":";
  const messageElement = createMessageElement(messageSender, data.message);
  chatContainer.appendChild(messageElement);
  messageInput.value = "";
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

function createMessageElement(name, message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message ";

  const messageContent = `
          <div class="name-message-container" >
          <span class="sender" >${name}</span>
          <p class="message-text" >${message}</p>
          </div>
        `;

  messageDiv.innerHTML = messageContent;
  return messageDiv;
}
