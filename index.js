let api = "https://api.punkapi.com/v2/beers";
let beerlist = [];

const fetcher = (addon = "") =>
  fetch(api + addon)
    .then((translate) => translate.json())
    .then((beers) => beers)
    .catch((error) => console.error(error));

const randomize = (fetched = fetcher("/random")) =>
  fetched.then((beer) =>
    beer.forEach((self) => {
      beerlist.push(self);
      self.image_url ?? (self.image_url = "beer.png");
      document.querySelector("#randombeer").innerHTML = `
      <div style="background-color: #${~~(Math.random() * 899999 + 100000)}; background-image: url('${self.image_url}')"></div>
      <h2>${self.name}</h2>
      <b id="moreInfo">More Info</b><br>
      <b id="anotherBeer">Another Beer</b>`;
      document.getElementById("anotherBeer").addEventListener("click", () => randomize());
      document.getElementById("moreInfo").addEventListener("click", () => randomize());
    })
  );

randomize();
