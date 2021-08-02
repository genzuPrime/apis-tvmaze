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

     // api get request with show title query
     const res = await axios.get('https://api.tvmaze.com/search/shows', {
          params: {
               q: query,
          },
     });

     const shows = res.data.map((response) => {
          const show = response.show;
          return {
               id: show.id,
               name: show.name,
               summary: show.summary,

               // Handles shows without images

               image: show.image
                    ? show.image.medium
                    : 'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300',
          };
     });
     return shows;

     // return [
     //   {
     //     id: 1767,
     //     name: "The Bletchley Circle",
     //     summary: "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
     //     image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
     //   }
     // ]
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
     const $showsList = $('#shows-list');
     $showsList.empty();

     for (let show of shows) {
          let $item = $(
               `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
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

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
     // TODO: get episodes from tvmaze
     //       you can get this by making GET request to
     //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
     // TODO: return array-of-episode-info, as described in docstring above

     //simmilar to searchShows()

     const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

     const episodes = res.data.map((episode) => ({
          id: episode.id,
          name: episode.name,
          season: episode.season,
          number: episode.number,
     }));

     return episodes;
}

//Populates/shows #episodes-area with ul of episodes

function populateEpisodes(episodes) {
     //simmilar to populateShows()

     const $episodesList = $('#episodes-list');

     //Clear existing episodes to keep area clean
     $episodesList.empty();

     //create li

     for (let episode of episodes) {
          const $item = $(
               `<li>
                    ${episode.name} (Episode ${episode.number} of Season ${episode.season})
               </li>`
          );

          $episodesList.append($item);
     }

     //change display property of #episodes-area from none to show

     $('#episodes-area').show();
}

//handle click on episode button
$('#shows-list').on(
     'click',
     '.get-episodes',
     async function handleEpisodesClick(e) {
          const id = $(e.target).closest('.Show').data('show-id');
          const episodes = await getEpisodes(id);
          populateEpisodes(episodes);
     }
);
