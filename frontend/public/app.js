document.addEventListener('DOMContentLoaded', () => {
    const surveyList = document.getElementById('survey-list');
    const createForm = document.getElementById('create-survey-form');
    const editForm = document.getElementById('edit-survey-form');

    // Fetch and display surveys
    async function fetchSurveys() {
        try {
            const response = await fetch('http://localhost:3000/api/surveys');
            const surveys = await response.json();

            surveyList.innerHTML = '';
            surveys.forEach(survey => {
                const li = document.createElement('li');
                li.textContent = `${survey.title} - ${survey.description}`;
                surveyList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching surveys:', error);
            alert('Error fetching surveys');
        }
    }

    // Handle survey creation
    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;

            try {
                const response = await fetch('http://localhost:3000/api/surveys', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description })
                });

                if (response.ok) {
                    window.location.href = 'surveys.html';
                } else {
                    alert('Error creating survey');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to connect to the server');
            }
        });
    }

    // Fetch surveys on page load
    if (surveyList) {
        fetchSurveys();
    }
});
