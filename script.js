const AZURE_ENDPOINT = 'https://edutop.openai.azure.com';
const AZURE_API_KEY = 'f1da31d5239b4fb5ace2184e40bb0f5f';

document.addEventListener('DOMContentLoaded', () => {
    const userQuestion = document.getElementById('userQuestion');
    const askButton = document.getElementById('askButton');
    const responseText = document.getElementById('responseText');
    const aiResponse = document.getElementById('aiResponse');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const buttonText = document.querySelector('.button-text');

    askButton.addEventListener('click', async () => {
        const question = userQuestion.value.trim();
        if (!question) return;

        // Show loading state
        askButton.disabled = true;
        buttonText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        aiResponse.classList.add('hidden');

        try {
            const response = await fetch(`${AZURE_ENDPOINT}/openai/deployments/GPT4o/chat/completions?api-version=2024-02-15-preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': AZURE_API_KEY,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant specializing in NASA's Kepler mission and exoplanets. Provide clear, concise answers about the mission, its discoveries, and exoplanets in general."
                        },
                        {
                            role: "user",
                            content: question
                        }
                    ],
                    max_tokens: 800,
                    temperature: 0.7,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    top_p: 0.95
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error:', response.status, errorData);
                throw new Error(`API returned ${response.status}: ${errorData}`);
            }

            const data = await response.json();
            if (!data.choices || !data.choices[0]) {
                console.error('Unexpected API response:', data);
                throw new Error('Invalid response format from API');
            }
            
            responseText.textContent = data.choices[0].message.content;
            aiResponse.classList.remove('hidden');
        } catch (error) {
            console.error('Error details:', error);
            responseText.textContent = `Error: ${error.message || 'An unexpected error occurred. Please try again.'}`;
            aiResponse.classList.remove('hidden');
        } finally {
            // Reset button state
            askButton.disabled = false;
            buttonText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    });
}); 