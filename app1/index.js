const socket = io("http://localhost:5050", { path: "/real-time" });

// Register User
const registerUser = async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;

  const dataUser = {
    username: username,
  };

  const response = await fetch("http://localhost:5050/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataUser),
  });

  const data = await response.json();
  if (response.ok) {
    socket.emit("new-user", data);
    alert("User registered successfully");
  } else {
    alert(data.message);
  }
};
document.getElementById("register").addEventListener("click", registerUser);

//Chat
const sendMessage = async (event) => {
  event.preventDefault();

  const message = document.getElementById("message").value;

  const dataMessage = {
    message: message,
  };

  const response = await fetch("http://localhost:5050/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataMessage),
  });

  const data = await response.json();
  if (response.ok) {
    socket.emit("new-message", data);
    alert("Message sent successfully");
  } else {
    alert(data.message);
  }
};
document.getElementById("send").addEventListener("click", sendMessage);

// Chat Messages
const messageCard = async () => {
  const container = document.getElementById("chat-container");
  if (!container) return;

  container.innerHTML = "";

  try {
    const response = await fetch("http://localhost:5050/messages");
    const data = await response.json();

    data.forEach((message) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.innerHTML = `<p>${message.message}</p>`;
      container.appendChild(messageElement);
    });
  } catch (error) {
    console.log(error);
  }
};

// Socket.io Events
// new-user
socket.on("new-user", (data) => {
  console.log("New user:", data);
  // userCard();
});

// new-message
socket.on("new-message", (data) => {
  console.log("New message:", data);
  messageCard();
});
