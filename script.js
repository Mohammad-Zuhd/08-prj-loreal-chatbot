/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Check if configuration is loaded
function checkConfiguration() {
  try {
    // More detailed configuration checking
    const hasWorkerURL =
      typeof CLOUDFLARE_WORKER_URL !== "undefined" &&
      CLOUDFLARE_WORKER_URL !== undefined &&
      CLOUDFLARE_WORKER_URL !==
        "https://your-worker-name.your-username.workers.dev" &&
      CLOUDFLARE_WORKER_URL !==
        "https://your-worker.your-subdomain.workers.dev";

    const hasAPIKey =
      typeof OPENAI_API_KEY !== "undefined" &&
      OPENAI_API_KEY !== undefined &&
      OPENAI_API_KEY !== "your-api-key-here";

    console.log("Configuration check:", {
      hasWorkerURL,
      hasAPIKey,
      workerURL:
        typeof CLOUDFLARE_WORKER_URL !== "undefined"
          ? CLOUDFLARE_WORKER_URL
          : "undefined",
      apiKeyExists: typeof OPENAI_API_KEY !== "undefined",
    });

    if (!hasWorkerURL && !hasAPIKey) {
      addMessage(
        "⚠️ Setup Required: Please copy 'secrets-template.js' to 'secrets.js' and configure your Cloudflare Worker URL or OpenAI API key. See the README.md for detailed setup instructions.",
        "system"
      );
      addMessage(
        "📋 Quick Setup:\n1. Copy secrets-template.js to secrets.js\n2. Add your Cloudflare Worker URL or OpenAI API key\n3. Refresh this page",
        "system"
      );
      // Disable the form
      chatForm.style.opacity = "0.5";
      chatForm.style.pointerEvents = "none";
      userInput.placeholder = "Setup required - see messages above";
      return false;
    }
    return true;
  } catch (error) {
    // If we can't even check the variables, they definitely don't exist
    addMessage(
      "⚠️ Configuration Missing: The secrets.js file was not found. Please check the setup instructions in README.md",
      "system"
    );
    // Disable the form
    chatForm.style.opacity = "0.5";
    chatForm.style.pointerEvents = "none";
    userInput.placeholder = "Configuration required - see message above";
    return false;
  }
}

// Conversation history to maintain context
let conversationHistory = [
  {
    role: "system",
    content:
      "You are a helpful L'Oréal product advisor. You only answer questions about L'Oréal products, beauty routines, skincare, haircare, and makeup. If someone asks about anything unrelated to L'Oréal or beauty, politely redirect them to ask about L'Oréal products instead. Keep your responses helpful, friendly, and focused on L'Oréal's product lines and beauty advice.",
  },
];

// Set initial message
function addMessage(content, type = "system") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `msg ${type}`;
  messageDiv.textContent = content;
  chatWindow.appendChild(messageDiv);

  // Scroll to bottom of chat window
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Enhanced function for animated thinking message
function showThinkingMessage() {
  const thinkingDiv = document.createElement("div");
  thinkingDiv.className = "msg thinking";
  thinkingDiv.innerHTML = `
    <span class="thinking-icon">🤔</span>
    <span class="thinking-dots">Thinking</span>
  `;
  chatWindow.appendChild(thinkingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return thinkingDiv;
}

// Enhanced function for typing animation effect
function addMessageWithTyping(content, type = "ai") {
  return new Promise((resolve) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `msg ${type} typing`;
    chatWindow.appendChild(messageDiv);

    // Scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Typing effect
    let index = 0;
    const typingSpeed = 30; // milliseconds per character

    function typeCharacter() {
      if (index < content.length) {
        messageDiv.textContent = content.substring(0, index + 1);
        index++;
        setTimeout(typeCharacter, typingSpeed);
        // Keep scrolling as text appears
        chatWindow.scrollTop = chatWindow.scrollHeight;
      } else {
        // Remove typing class when done
        messageDiv.classList.remove("typing");
        resolve();
      }
    }

    // Start typing after a brief delay
    setTimeout(typeCharacter, 200);
  });
}

// Initialize chat with welcome message
// Use setTimeout to ensure DOM is ready and secrets.js has had time to load
setTimeout(() => {
  if (checkConfiguration()) {
    addMessage(
      "👋 Hello! I'm your L'Oréal Smart Product Advisor. Ask me about our skincare, haircare, makeup products, or beauty routines!"
    );
  }
}, 100);

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Check configuration before processing
  if (!checkConfiguration()) {
    return;
  }

  // Get user input
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Display user message with animation
  addMessage(userMessage, "user");

  // Clear input field
  userInput.value = "";

  // Show enhanced thinking animation
  const thinkingDiv = showThinkingMessage();

  try {
    // Add user message to conversation history
    conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    // Check if we have Cloudflare Worker URL and prefer that for security
    let response;

    // Check if secrets.js loaded properly with try-catch
    let workerUrl, apiKey;
    try {
      workerUrl =
        typeof CLOUDFLARE_WORKER_URL !== "undefined"
          ? CLOUDFLARE_WORKER_URL
          : null;
      apiKey = typeof OPENAI_API_KEY !== "undefined" ? OPENAI_API_KEY : null;
    } catch (error) {
      throw new Error(
        "Configuration not found. Please ensure you have the secrets.js file in the same directory."
      );
    }

    if (
      workerUrl &&
      workerUrl !== "https://your-worker-name.your-username.workers.dev" &&
      workerUrl !== "https://your-worker.your-subdomain.workers.dev"
    ) {
      // Use Cloudflare Worker (secure deployment)
      response = await fetch(workerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory,
        }),
      });
    } else if (apiKey && apiKey !== "your-api-key-here") {
      // Fallback to direct OpenAI API call (for development only)
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: conversationHistory,
          max_completion_tokens: 300,
        }),
      });
    } else {
      throw new Error(
        "No valid configuration found. Please set up either Cloudflare Worker URL or OpenAI API key in secrets.js"
      );
    }

    // Parse the response
    const data = await response.json();

    // Check if we got a valid response
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const aiResponse = data.choices[0].message.content;

      // Add AI response to conversation history
      conversationHistory.push({
        role: "assistant",
        content: aiResponse,
      });

      // Display AI response with typing animation, then remove thinking bubble
      await addMessageWithTyping(aiResponse, "ai");

      // Remove thinking message AFTER typing is complete
      if (thinkingDiv.parentNode) {
        chatWindow.removeChild(thinkingDiv);
      }
    } else {
      // Handle error case with typing animation
      await addMessageWithTyping(
        "Sorry, I'm having trouble connecting right now. Please try again!",
        "ai"
      );

      // Remove thinking message AFTER error message is typed
      if (thinkingDiv.parentNode) {
        chatWindow.removeChild(thinkingDiv);
      }
    }
  } catch (error) {
    // Show error message with typing animation first
    console.error("Error:", error);
    await addMessageWithTyping(
      "Sorry, I encountered an error. Please check your connection and try again.",
      "ai"
    );

    // Remove thinking message AFTER error message is typed
    if (thinkingDiv.parentNode) {
      chatWindow.removeChild(thinkingDiv);
    }
  }
});

// Focus on input field when page loads
userInput.focus();
