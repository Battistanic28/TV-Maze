/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	let response = await axios.get(`http://api.tvmaze.com/singlesearch/shows?q=${query}`);

	return [
		{
			id: response.data.id,
			name: response.data.name,
			summary: response.data.summary,
			image: response.data.image.original
		}
	];
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		if (show.image === null) {
			show.image = 'https://tinyurl.com/tv-missing';
		}

		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
      <div class="card" data-show-id="${show.id}">
      <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">${show.summary}</p>
      <img class="card-img-top" src="${show.image}">
      <div class="text-center">
      <button class="show-episodes btn btn-primary m-2">Show Episodes</button>
      </div>
      </div>
      </div>
      </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

// const showEpisodes = document.querySelector('.show-episodes')
// showEpisodes.addEventListener('click' showEpisodes);

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(showId) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above
	let response = await axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`);
	return response.data;
}

async function populateEpisodes(episodeInfo) {
	$('#episodes-list').empty()
	for (let data of await episodeInfo) {
		let info = `${data.name} --- Season: ${data.season}, Episode: ${data.number}`;
		let newLi = document.createElement('li');
		newLi.innerHTML = info;
		document.querySelector('#episodes-list').appendChild(newLi);
	}
	  $('#episodes-area').show();
}

$("#shows-list").on("click", ".show-episodes", async function handleEpisodeClick(evt) {
	let showId = $(evt.target).closest(".Show").data("show-id");
	let episodes = await getEpisodes(showId);
	populateEpisodes(episodes);
  });
