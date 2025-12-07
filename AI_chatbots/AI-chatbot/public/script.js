const chat = document.getElementById('chat');
const input = document.getElementById('input');
const form = document.getElementById('chat-form');

// Haetaan historia tai luodaan tyhjä
let history = JSON.parse(localStorage.getItem('chat-history')) || [];

function addMessage(text, sender, save = true) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;

  if (save) {
    history.push({ text, sender });
    localStorage.setItem('chat-history', JSON.stringify(history));
  }
}

function renderHistory() {
  chat.innerHTML = '';
  history.forEach(msg => {
    // Ei tallenneta uudelleen
    addMessage(msg.text, msg.sender, false);
  });
}

// Viestin lähetys
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;
  addMessage(userText, 'user');
  input.value = '';
  input.disabled = true;

  const placeholder = document.createElement('div');
  placeholder.classList.add('message', 'bot');
  placeholder.textContent = '...';
  chat.appendChild(placeholder);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await res.json();
    chat.removeChild(placeholder);
    addMessage(data.reply, 'bot');
  } catch (error) {
    chat.removeChild(placeholder);
    addMessage('❌ Virhe vastauksessa.', 'bot');
  }

  input.disabled = false;
  input.focus();
});

// Tyhjennä historia (valinnainen nappi)
function clearHistory() {
  localStorage.removeItem('chat-history');
  history = [];
  renderHistory();
}

// 🔁 Lataa historia kerran
renderHistory();
