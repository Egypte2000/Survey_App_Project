document.addEventListener('DOMContentLoaded', () => {
    const surveyList = document.getElementById('survey-list');
    const createForm = document.getElementById('create-survey-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('id');

    // Fetch and display surveys
    async function fetchSurveys() {
        const response = await fetch('http://localhost:3000/api/surveys');
        const surveys = await response.json();

        surveyList.innerHTML = '';
        surveys.forEach(survey => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${survey.title} - ${survey.description}
                <button onclick="deleteSurvey('${survey._id}')">Delete</button>
                <button onclick="editSurvey('${survey._id}')">Edit</button>
            `;
            surveyList.appendChild(li);
        });
    }

    // Handle survey creation or update
    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = titleInput.value;
            const description = descriptionInput.value;

            if (surveyId) {
                // Update existing survey
                await fetch(`http://localhost:3000/api/surveys/${surveyId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description })
                });
            } else {
                // Create new survey
                await fetch('http://localhost:3000/api/surveys', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description })
                });
            }

            window.location.href = 'surveys.html';
        });
    }

    // Function to delete a survey
    window.deleteSurvey = async (id) => {
        if (confirm('Are you sure you want to delete this survey?')) {
            await fetch(`http://localhost:3000/api/surveys/${id}`, { method: 'DELETE' });
            fetchSurveys(); // Refresh the list after deletion
        }
    };

    // Function to redirect to the create page with the survey ID for editing
    window.editSurvey = (id) => {
        window.location.href = `create.html?id=${id}`;
    };

    // Populate form fields when editing a survey
    async function populateFormForEdit() {
        if (surveyId) {
            const response = await fetch(`http://localhost:3000/api/surveys/${surveyId}`);
            const survey = await response.json();
            titleInput.value = survey.title;
            descriptionInput.value = survey.description;
        }
    }

    // Fetch surveys on page load
    if (surveyList) {
        fetchSurveys();
    }

    // Populate form if editing a survey
    if (surveyId) {
        populateFormForEdit();
    }
});
