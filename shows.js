const searchForm = document.getElementById('search-form') 
const searchInput = document.getElementById('search-input')
const userSearchType = document.getElementById('search-type')
const container = document.getElementById('popular-shows-container');

document.addEventListener('DOMContentLoaded', displayPopularShows); //run displayPopularShows when page loads

if (searchForm) {
    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();  //stops page from reloading when you search

        const query = searchInput.value.trim(); //assign input to variable
        const currentSearchType = userSearchType ? userSearchType.value : 'show';
    
        if(!query) {
            displayPopularShows();  //display popular shows as normal if search is empty
            return;
        } else {
            TVMazeSearch(query, currentSearchType); //search query if not empty
        }
    })
}


async function displayPopularShows() {
  const url = `https://api.tvmaze.com/shows?page=0`
  
  try {
    const response = await fetch(url); //fetches first page of shows
    if(!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const shows = await response.json()

    const popularShows = shows //filter by rating to find most popular shows
    .filter(show => show.rating && show.rating.average)
    .sort((a, b) => b.rating.average - a.rating.average)
    .slice(0,50);

    container.innerHTML = ''; //empty container
    popularShows.forEach(show => { //render cards for display
        const showCard = document.createElement('div');
        showCard.className = 'show-card';
        showCard.dataset.id = show.id;
        showCard.dataset.type = 'show';

        const imgSrc = show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image'; 

        showCard.innerHTML = `
        <img src="${imgSrc}" alt="${show.name}">
        <h3>${show.name}</h3>
        <p class="rating">⭐️ ${show.rating.average}/10</p>
        <p class="genres">${show.genres.join(', ')}</p> `;
        
        container.appendChild(showCard);
    });
    } catch (error) {
        console.log('Error fetching TVMaze data', error);
    }
} 

async function TVMazeSearch(query, searchType) {
    const apiEndpoint = searchType === 'show' ? 'shows' : 'people';
    const url = `https://api.tvmaze.com/search/${apiEndpoint}?q=${encodeURIComponent(query)}`;

    try {
        container.innerHTML = `<p class="text-gray-500 text-center col-span-full"> Searching...</p>`;

        const response = await fetch(url);
        if(!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const results = await response.json();
        container.innerHTML = ``; 

        if(results.length == 0) {
            container.innerHTML = `<p class="text-gray-500 text-center col-span-full"> No results found for ${query}</p>`
            return; 
        }

        results.forEach(item => {
            const data = searchType === 'show' ? item.show : item.person;
            const showCard = document.createElement('div');
            showCard.className = 'show-card cursor-pointer bg-white rounded-xl shadow-md border border-gray-300 p-4 flex flex-col justify-between';

            showCard.dataset.id = data.id;
            showCard.dataset.type = searchType;

            const imgSrc = data.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image'; 

            if(searchType == 'show') {
                showCard.innerHTML = `
                <img src="${imgSrc}" alt="${data.name}" class="w-full h-72 object-cover rounded-lg mb-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-1">${data.name}</h3>
                    <p class="rating">⭐️ ${data.rating.average}/10</p>
                    <p class="genres">${data.genres.join(', ')}</p> 
                </div>`;
            } else if(searchType == 'actor') {
                showCard.innerHTML = `
                <img src="${imgSrc}" alt="${data.name}" class="w-full h-72 object-cover rounded-lg mb-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-1">${data.name}</h3>
                    <p class="country text-sm text-gray-500">📍${data.country?.name || 'Unknown'}</p>
                    <p class="birthday text-sm text-gray-500">🎉${data.birthday || 'N/A'}</p>
                </div>
                `
            }
            container.appendChild(showCard);
        })
        } catch (error) {
        console.log("Error fetching TVMaze data", error);
        container.innerHTML = '<p class="text-red-500 text-center col-span-full">Something went wrong, please try again.</p>';
    }
}

document.addEventListener('click', function(event) {
    const cardSelected = event.target.closest('.show-card');
    if(!cardSelected){
        return;
    }

    const id = cardSelected.dataset.id;
    const type = cardSelected.dataset.type;

    if(id && type) {
        window.location.href = `display.html?id=${id}&type=${type}`;
    }
});

