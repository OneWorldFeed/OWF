/**
 * OWF | One World Feed
 * modules/ai/ai.js — AI chat interface page module.
 */

// ── Chat message factory ──────────────────────────────────────────────────────

/**
 * Build a chat message bubble element.
 * All content is set via textContent — no user input goes to innerHTML.
 * @param {'user'|'assistant'} role
 * @param {string} text
 * @returns {HTMLElement}
 */
function _buildMessage(role, text) {
  const li = document.createElement('li');
  li.className = `chat-message chat-message--${role}`;
  li.setAttribute('role', 'listitem');

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;

  const meta = document.createElement('span');
  meta.className = 'chat-meta';
  meta.setAttribute('aria-hidden', 'true');
  meta.textContent = role === 'user' ? 'You' : 'OWF AI';

  li.appendChild(meta);
  li.appendChild(bubble);
  return li;
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function _buildTypingIndicator() {
  const li = document.createElement('li');
  li.id = 'chat-typing-indicator';
  li.className = 'chat-message chat-message--assistant chat-typing';
  li.setAttribute('aria-label', 'AI is typing');

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'typing-dot';
    dot.setAttribute('aria-hidden', 'true');
    bubble.appendChild(dot);
  }

  li.appendChild(bubble);
  return li;
}

// ── Simulated AI response ─────────────────────────────────────────────────────

const DEMO_RESPONSES = [
  'Great question! Here\'s a summary of the latest global news...',
  'Based on current trends, here are the top stories for you today.',
  'I found several relevant articles. Would you like me to filter by region?',
  'The latest updates on this topic come from multiple reliable sources.',
  'Here\'s what\'s trending right now across the One World Feed.',
];

function _getAiResponse() {
  return DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
}

// ── Chat logic ────────────────────────────────────────────────────────────────

let _chatList    = null;
let _inputEl     = null;
let _sendBtn     = null;
let _isTyping    = false;

function _scrollToBottom() {
  if (_chatList) {
    _chatList.scrollTop = _chatList.scrollHeight;
  }
}

async function _sendMessage() {
  if (_isTyping) return;

  const text = _inputEl?.value?.trim() ?? '';
  if (!text) return;

  // Clear input
  _inputEl.value = '';

  // Append user message
  const userMsg = _buildMessage('user', text);
  _chatList.appendChild(userMsg);
  _scrollToBottom();

  // Show typing indicator
  _isTyping = true;
  const typing = _buildTypingIndicator();
  _chatList.appendChild(typing);
  _scrollToBottom();

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

  // Remove typing indicator
  typing.remove();

  // Append AI response
  const aiMsg = _buildMessage('assistant', _getAiResponse());
  _chatList.appendChild(aiMsg);
  _scrollToBottom();

  _isTyping = false;
}

function _setupChatForm() {
  _chatList = document.getElementById('chat-messages')
    ?? document.querySelector('.chat-messages');
  _inputEl  = document.getElementById('chat-input');
  _sendBtn  = document.getElementById('chat-send-btn');

  if (!_chatList || !_inputEl) return;

  // Send on button click
  if (_sendBtn) {
    _sendBtn.addEventListener('click', _sendMessage);
  }

  // Send on Enter (Shift+Enter = newline)
  _inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      _sendMessage();
    }
  });

  // Append welcome message
  const welcome = _buildMessage('assistant',
    'Hello! I\'m your OWF AI assistant. Ask me anything about today\'s news, '
    + 'trending topics, or to curate a personalised feed for you.');
  _chatList.appendChild(welcome);
}

// ── Suggested prompts ─────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  'What\'s happening in the world today?',
  'Show me the top science stories',
  'Summarise global climate news',
  'What\'s trending in music?',
];

function _renderSuggestedPrompts() {
  const container = document.getElementById('chat-suggestions')
    ?? document.querySelector('.chat-suggestions');
  if (!container) return;

  const fragment = document.createDocumentFragment();

  SUGGESTED_PROMPTS.forEach((prompt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chat-suggestion-btn';
    btn.textContent = prompt;
    btn.setAttribute('aria-label', `Send prompt: ${prompt}`);

    btn.addEventListener('click', () => {
      if (_inputEl) {
        _inputEl.value = prompt;
        _sendMessage();
      }
    });

    fragment.appendChild(btn);
  });

  container.appendChild(fragment);
}

// ── init ──────────────────────────────────────────────────────────────────────

export async function init() {
  _setupChatForm();
  _renderSuggestedPrompts();
  console.info('[OWF:ai] Initialised.');
}

export default { init };
