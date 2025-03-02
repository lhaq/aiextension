let suggestionBox = null;
let lastTypedText = "";

// Create a floating suggestion box
function createSuggestionBox() {
    suggestionBox = document.createElement("div");
    suggestionBox.className = "ai-suggestion-box";
    document.body.appendChild(suggestionBox);
}

// Fetch AI completion from background script
async function fetchCompletion(text) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "get_completion", text }, (response) => {
            resolve(response.completion);
        });
    });
}

// Position suggestion box near cursor
function positionSuggestionBox(textField) {
    const rect = textField.getBoundingClientRect();
    suggestionBox.style.left = `${rect.left + window.scrollX}px`;
    suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
    suggestionBox.style.width = `${rect.width}px`;
}

// Handle text input
document.addEventListener("input", async (event) => {
    const target = event.target;
    if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        const text = target.value;
        lastTypedText = text;

        if (!suggestionBox) createSuggestionBox();
        positionSuggestionBox(target);

        const completion = await fetchCompletion(text);
        suggestionBox.innerText = completion;
        suggestionBox.style.display = completion ? "block" : "none";
    }
});

// Handle tab key to accept suggestion
document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && suggestionBox && suggestionBox.innerText) {
        event.preventDefault();
        const activeElement = document.activeElement;
        if (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT") {
            activeElement.value = lastTypedText + suggestionBox.innerText;
            suggestionBox.style.display = "none";
        }
    }
});
