document.addEventListener('DOMContentLoaded', async () => {
    const displayContainer = document.getElementById('display-container');

    const urlParameters = new URLSearchParams(window.location.search);
    const id = urlParameters.get('id');
    const type = urlParameters.get('type');

    if(!id || !type) {
        displayContainer.innerHTML = `<p class="text-red-500">Missing ID or Type</p>`
        return;
    }

    const apiEndpoint = type === 'show' ? 'shows' : 'people';
    const url = `https://api.tvmaze.com/${apiEndpoint}/${id}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        if(type == 'show'){
            renderShowDetails(data, displayContainer);
        } else {
             renderActorDetails(data, displayContainer);
        }

    } catch (error) {
        console.log("Could not load details", error);
    }
});

function renderShowDetails(show, container) {
    const imgSrc = show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image';
    container.innerHTML = `
    <img src="${imgSrc}" alt="${show.name}" class="w-full md:w-64 h-auto object-cover rounded-lg shadow">
    <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">${show.name}</h1>
        <p class="text-yellow-500 font-semibold mb-2">⭐️${show.rating?.average || 'N/A'}/10</p> 
        <p class="text-sm text-gray-600 mb-4">Genre(s): ${show.genres?.join(', ') || 'None'}</p>
        <p class="text-sm text-gray-600 mb-4">Language: ${show.language || 'Unknown'}</p>
        <div class="prose text-gray-700">
            <strong>Summary: </strong>
            ${show.summary || '<p>No Summary available.</p>'}
        </div> 
    </div>
    `;

}

function renderActorDetails(person, container) {
    const imgSrc = person.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image';

    container.innerHTML = `
    <img src="${imgSrc}" alt="${person.name}" class="w-full md:w-64 h-auto object-cover rounded-lg shadow">
    <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">${person.name}</h1>
        <p class="text-gray-700 mb-2">📍Country: ${person.country?.name || 'Unknown'}</p>
        <p class="text-gray-700 mb-2">🎉Birthday: ${person.birthday || 'N/A'}</p>
        <p class="text-gray-700 mb-2">⚰️Death day: ${person.deathday || 'N/A'}</p>
        <p class="text-gray-700 mb-2">👤Gender: ${person.gender}</p>
    </div>
    `;
}

