function addMessage(name, text, type) {
    let messages = document.getElementById("messages");

    let bubble = document.createElement("div");
    bubble.className = "message " + type;

    let sender = document.createElement("span");
    sender.className = "message-name";
    sender.textContent = name;

    let content = document.createElement("span");
    content.className = "message-content";
    content.textContent = text;

    let time = document.createElement("span");
    time.className = "message-time";

    let now = new Date();
    time.textContent = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    if (type === "rin") {
    let header = document.createElement("div");
    header.className = "message-header";

    let avatar = document.createElement("img");
    avatar.src = "rin.png";
    avatar.alt = "Rin-san";
    avatar.className = "avatar";

    header.appendChild(avatar);
    header.appendChild(sender);
    bubble.appendChild(header);
    } else {
    bubble.appendChild(sender);
    }
    bubble.appendChild(content);
    bubble.appendChild(time);

    messages.appendChild(bubble);

    messages.scrollTop = messages.scrollHeight;

    return bubble;
}

const WORKER_URL = "https://rin-san.ridwanhama111p.workers.dev";
let history = [];

async function getReply(text) {
    history.push({ role: "user", content: text });

    try {
        let r = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: history })
        });
        let data = await r.json();

        history.push({ role: "assistant", content: data.reply });
        return data.reply;
    } catch (err) {
        history.pop();
        return "Hmph! Koneksinya bermasalah. Coba lagi nanti!";
    }
}

async function sendMessage() {
    let input = document.getElementById("userInput");
    let text = input.value.trim();

    if (text === "") return;

    addMessage("Kamu", text, "user");
    input.value = "";

    let typing = addMessage("Rin-san", "", "rin");
    typing.classList.add("typing-bubble");

    for (let i = 0; i < 3; i++) {
        let dot = document.createElement("span");
        dot.className = "typing-dot";
        typing.appendChild(dot);
    }

    let reply = await getReply(text);

    typing.remove();
    addMessage("Rin-san", reply, "rin");
}

typing.classList.add("typing-bubble");

document.getElementById("userInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") sendMessage();
});