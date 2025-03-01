let suggestionsContainer;

function createSuggestionsContainer() {
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'autocomplete-suggestions';
    suggestionsContainer.style.position = 'absolute';
    suggestionsContainer.style.zIndex = '1000';
    suggestionsContainer.style.backgroundColor = 'white';
    suggestionsContainer.style.border = '1px solid #ccc';
    suggestionsContainer.style.display = 'none';
    document.body.appendChild(suggestionsContainer);
}

function showSuggestions(suggestions, inputElement) {
    suggestionsContainer.innerHTML = '';
    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = suggestion;
        suggestionItem.onclick = () => {
            inputElement.value += suggestion;
            suggestionsContainer.style.display = 'none';
        };
        suggestionsContainer.appendChild(suggestionItem);
    });
    suggestionsContainer.style.display = 'block';
    positionSuggestionsContainer(inputElement);
}

function positionSuggestionsContainer(inputElement) {
    const rect = inputElement.getBoundingClientRect();
    suggestionsContainer.style.top = `${rect.bottom + window.scrollY}px`;
    suggestionsContainer.style.left = `${rect.left + window.scrollX}px`;
}

document.addEventListener('input', (event) => {
    const inputElement = event.target;
    if (inputElement.tagName === 'TEXTAREA' || (inputElement.tagName === 'INPUT' && inputElement.type === 'text')) {
        const text = inputElement.value;
        // Call your AI API to get suggestions
        fetchSuggestions(text).then(suggestions => {
            showSuggestions(suggestions, inputElement);
        });
    }
});

// Replace the fetchSuggestions function with the OpenAI API call
async function fetchSuggestions(text) {
    const openai = new OpenAI({
        apiKey: "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",
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                { "role": "user", "content": text },
            ],
        });

        const suggestions = completion.choices.map(choice => choice.message.content);
        return suggestions;
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return []; // Return an empty array in case of error
    }
}

document.addEventListener('keydown', (event) => {
    const inputElement = document.activeElement;
    if (event.key === 'Tab' && suggestionsContainer.style.display === 'block') {
        event.preventDefault();
        const firstSuggestion = suggestionsContainer.firstChild;
        if (firstSuggestion) {
            inputElement.value += firstSuggestion.textContent;
            suggestionsContainer.style.display = 'none';
        }
    }
});

createSuggestionsContainer();
