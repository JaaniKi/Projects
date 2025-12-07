// Elementtien referenssit
const toggleBtn = document.getElementById('chat-toggle');
const chatBox = document.querySelector('.chat-widget');
const chat = document.getElementById('chat');
const input = document.getElementById('input');
const form = document.getElementById('chat-form');
const faqButtons = document.querySelectorAll('.faq-btn');

let greeted = false;
let isOpen = false;

// Avaa tai sulje botti-ikkuna
toggleBtn.onclick = () => {
  isOpen = !isOpen;

  if (isOpen) {
    chatBox.classList.add('active');
    toggleBtn.innerHTML = '✖ Sulje';
    input.focus();

    // Tervetuloviesti vain kerran
    if (!greeted) {
      setTimeout(() => {
        addMessage("Hei! Kuinka voin auttaa?", 'bot');
      }, 300);
      greeted = true;
    }
  } else {
    chatBox.classList.remove('active');
    toggleBtn.innerHTML = '💬 Apubotti';
  }
};

// Viestin lisääminen ruutuun
function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// Lomakkeen lähetys
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  input.value = '';
  sendToBot(text);
});

// FAQ-painikkeiden toiminta
faqButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.textContent;
    addMessage(text, 'user');
    sendToBot(text);
  });
});

// Botille lähetys
async function sendToBot(text) {
  input.disabled = true;
  addMessage('...', 'bot');

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    chat.lastChild.remove(); // poista placeholder
    addMessage(data.reply, 'bot');
  } catch {
    chat.lastChild.remove();
    addMessage('⚠️ Virhe palvelussa', 'bot');
  }

  input.disabled = false;
}
