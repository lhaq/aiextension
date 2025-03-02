// Save API key to Chrome storage
document.getElementById("saveKey").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKey").value.trim();
  if (apiKey) {
      chrome.storage.local.set({ apiKey }, () => {
          alert("API Key saved!");
      });
  } else {
      alert("Please enter a valid API Key.");
  }
});

// Load stored API key on popup open
chrome.storage.local.get("apiKey", (data) => {
  if (data.apiKey) {
      document.getElementById("apiKey").value = data.apiKey;
  }
});

// Toggle enable/disable functionality
document.getElementById("toggle").addEventListener("click", () => {
  chrome.storage.local.get("enabled", (data) => {
      const newState = !data.enabled;
      chrome.storage.local.set({ enabled: newState }, () => {
          document.getElementById("toggle").innerText = newState ? "Disable" : "Enable";
      });
  });
});

// Set button state on load
chrome.storage.local.get("enabled", (data) => {
  document.getElementById("toggle").innerText = data.enabled ? "Disable" : "Enable";
});
