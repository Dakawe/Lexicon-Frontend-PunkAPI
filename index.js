const $ = (element = new String()) => document.querySelector(element),
  output = [],
  FetchAPI = async (url_addon = "", page, url = `https://api.punkapi.com/v2/beers?${url_addon}&page=${page}&per_page=9`) => {
    return await (await fetch(url)).json();
  },
  StoreOutput = async (url, page, result) => {
    result = await FetchAPI(url, page);
    result.length && output.push(result) && (await StoreOutput(url, page + 1));
  },
  clearOldOutput = () => {
    (output.length = 0), ($(`#results-pages`).innerHTML = ""), ($(`#results-list`).innerHTML = "");
  };

$(`#search`).addEventListener(`submit`, async (e, input = new FormData(e.target), search) => {
  e.preventDefault(), clearOldOutput();
  search = `beer_name=${input.get("beer")}`;
  await StoreOutput(search, 1);
  for (const page in output) {
    $(`#results-pages`).innerHTML += `<p class="page-select">${+page + 1}</p>`;
  }
  document.querySelectorAll(`.page-select`).forEach((page) =>
    page.addEventListener(`click`, (p) => {
      $(`#results-list`).innerHTML = "";
      for (const self of output[+p.target.innerText - 1]) {
        
        $(`#results-list`).innerHTML += `<article><img src="${self.image_url ?? "beer.png"}"><h3>${self.name}</h3></article>`;
      }
    }));
    $(".page-select").click();
});
