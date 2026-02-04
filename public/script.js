document.getElementById("tweetForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const author = document.getElementById("author").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!author || !message) return;

  await fetch("/tweets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, message }),
  });

  document.getElementById("author").value = "";
  document.getElementById("message").value = "";

  loadTweets();
});

async function loadTweets() {
  const res = await fetch("/tweets");
  const tweets = await res.json();

  const container = document.getElementById("tweets");
  container.innerHTML = "";

  tweets.reverse().forEach((tweet) => {
    const div = document.createElement("div");
    div.className = "tweet";
    div.id = `tweet-${tweet.id}`;

    div.innerHTML = `
      <div class="tweet-content">
        <strong>${tweet.author}</strong> <em>${tweet.date}</em><br/>
        <span class="message">${tweet.message}</span>
      </div>
      <div class="tweet-buttons">
        <button class="edit" onclick="editTweet('${tweet.id}')">Bearbeiten</button>
        <button class="delete" onclick="deleteTweet('${tweet.id}')">Löschen</button>
      </div>
    `;

    container.appendChild(div);
  });
}

async function deleteTweet(id) {
  await fetch(`/tweets/${id}`, {
    method: "DELETE",
  });
  loadTweets();
}

function editTweet(id) {
  const div = document.getElementById(`tweet-${id}`);
  const contentDiv = div.querySelector(".tweet-content");
  const messageSpan = contentDiv.querySelector(".message");
  const oldMessage = messageSpan.innerText;

  const input = document.createElement("input");
  input.type = "text";
  input.value = oldMessage;
  input.style.width = "100%";

  messageSpan.replaceWith(input);

  const buttonDiv = div.querySelector(".tweet-buttons");
  buttonDiv.innerHTML = "";

  const saveBtn = document.createElement("button");
  saveBtn.className = "save";
  saveBtn.innerText = "Speichern";
  saveBtn.onclick = async () => {
    const newMessage = input.value.trim();
    if (!newMessage) return;

    await fetch(`/tweets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage }),
    });

    loadTweets();
  };

  buttonDiv.appendChild(saveBtn);
}

loadTweets();
