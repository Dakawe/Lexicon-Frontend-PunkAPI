const $ = (element = new String()) => document.querySelector(element),
  output = [],
  FetchAPI = async (url_addon = "", page, url = `https://api.punkapi.com/v2/beers?${url_addon}&page=${page}&per_page=6`) => {
    return await (await fetch(url)).json();
  },
  StoreOutput = async (url, page, result) => {
    result = await FetchAPI(url, page);
    result.length && output.push(result) && (await StoreOutput(url, page + 1));
  },
  clearOldOutput = () => {
    (output.length = 0), ($(`#results-pages`).innerHTML = "");
    $(`#results-pages`).style.visibility = "hidden";
  };

$(`#search`).addEventListener(`submit`, async (e, input = new FormData(e.target), search = "") => {
  e.preventDefault(), clearOldOutput();
  if (input.get("beer") == "") {
    return console.error("NO BEERDATA");
  }
  search += `beer_name=${input.get("beer")}&`;
  +$(`#abv`).value && (search += `abv_lt=${$(`#abv`).value}&`);

  if (search == "") {
    return console.error("NO SEARCHDATA");
  }

  await StoreOutput(search, 1);
  $(`#results-pages`).style.visibility = "visible";
  for (const page in output) {
    $(`#results-pages`).innerHTML += `<p class="page-select">${+page + 1}</p>`;
  }
  document.querySelectorAll(`.page-select`).forEach((page) =>
    page.addEventListener(`click`, (p) => {
      $(`#results-list`).innerHTML = "";
      for (const self of output[+p.target.innerText - 1]) {
        const malt = [],
          hops = [];
        for (const i of self.ingredients.malt) {
          malt.includes(i.name) || malt.push(i.name);
        }
        for (const i of self.ingredients.hops) {
          hops.includes(i.name) || hops.push(i.name);
        }
        $(`#results-list`).innerHTML += `<article>
        <img src="${self.image_url ?? "beer.png"}"><h3>${self.name}</h3>
        <section class="more-info">
        <p class="description"><b>ABOUT THE BEER </b>${self.description}</p>
        <div><b>AlCohOl peRceNTaGe:</b><p>${self.abv}%</p></div>
        <b>Fluid volume:</b><p>${self.volume.value} ${self.volume.unit}</p>
        <b>MALT :</b><p>${malt.join(` | `)}</p>
        <b>HopS :</b><p>${hops.join(` | `)}</p>
        <b>YeaST :</b><p>${self.ingredients.yeast}</p>
        <p class="description"><b>A BREWERS ADVICE </b>${self.brewers_tips}</p>
        <b>Works well with:</b><p>${self.food_pairing.join(` <br> `)}</p>
        </section>
        </article>`;

        document.querySelectorAll(`#results-list article`).forEach((page) =>
          page.addEventListener(`click`, (e) => {
            const target = e.target.closest("article").querySelector(".more-info");
            const info = window.getComputedStyle(target);
            info.display == "none" ? (target.style.display = "block") : (target.style.display = "none");
          })
        );
      }
    })
  );
  $(".page-select").click();
});

$(`#abv`).oninput = function () {
  $(`#abv-output`).innerText = `${this.value}%`;
};
$;
