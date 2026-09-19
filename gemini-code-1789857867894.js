async function sendMessage() {
  const input = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const val = input.value.trim();
  
  if (!val) return;

  // 1. Display User Message
  const userDiv = document.createElement('div');
  userDiv.className = 'message user';
  userDiv.innerText = val;
  chatBox.appendChild(userDiv);

  // Update chat history format for Gemini API
  chatHistory.push({ role: 'user', parts: [{ text: val }] });
  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  // 2. Display Placeholder
  const aiDiv = document.createElement('div');
  aiDiv.className = 'message assistant';
  aiDiv.innerText = "Ziva is thinking...";
  chatBox.appendChild(aiDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // INSERT YOUR GEMINI API KEY HERE (or use a serverless backend function)
    const API_KEY = "YOUR_GEMINI_API_KEY"; 

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: chatHistory,
        systemInstruction: {
          parts: [{ text: "You are Ziva, an authentic, supportive, and brilliant AI collaboration partner. Talk naturally, warmly, and directly without stiff corporate templates." }]
        }
      })
    });

    const data = await response.json();
    const botReply = data.candidates[0].content.parts[0].text;

    // 3. Display AI Response
    aiDiv.innerText = botReply;
    chatHistory.push({ role: 'model', parts: [{ text: botReply }] });
    chatBox.scrollTop = chatBox.scrollHeight;

    // Speak natural response
    speakText(botReply);

  } catch (error) {
    aiDiv.innerText = "I had a slight bump connecting to my AI brain. Let's try sending that again!";
  }
}