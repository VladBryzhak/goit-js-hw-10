
import { fetchBreeds, fetchCatByBreed } from "./js/cat-api";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const elements = {
    selector: document.querySelector(".breed-select"),
    info: document.querySelector(".cat-info"),
    loader: document.querySelector(".loader"),
    error: document.querySelector(".loader")
}

elements.selector.addEventListener('change', selectHandler);

Loading.circle("Loading...");

elements.selector.innerHTML = `<option disabled selected>Select a breed...</option>`

fetchBreeds()
    .then(data => {
        const breedList = data.map(breed => {
            return { name: breed.name, id: breed.id }
        })
        return breedList
    })
    .then(breedList => {
        elements.selector.insertAdjacentHTML("beforeend", selectMarkup(breedList).join(""));
       
    })
    .catch(err => {
        Notify.failure('Oops! Something went wrong! Try reloading the page!');
        console.log(err);
    })
    .finally(data => {
        elements.selector.style.display = 'block';
        Loading.remove();
    })

function selectHandler(evt) {
    Loading.circle("Loading");
    fetchCatByBreed(evt.currentTarget.value)
        .then(data => {
            Loading.circle("Loading");
            console.dir(elements.info);
            elements.info.innerHTML = infoMarkup(data);
        })
        .catch(err => {
            Notify.failure('Oops! Something went wrong! Try reloading the page!')
            console.log(err);
        })
        .finally(data => Loading.remove())
}

function selectMarkup(arr) {
    return arr.map(({ name, id }) => `<option value="${id}">${name}</option>`)
}

function infoMarkup(breed) {
    const { name, description, temperament } = breed[0].breeds[0];
    const imgUrl = breed[0].url
    const markup =
        `<div class="cat-info-img">
            <img src="${imgUrl}" alt="${name}" width="100%" preload="lazy">
        </div>
        <div class="cat-info-content">      
            <h1>${name}</h1>
            <h2>${temperament}</h2>
            <p>${description}</p>
        </div>`
    return markup;
}

Notify.init({
    position: 'right-top',
    width: '500px',
    fontSize: '18px',
    useIcon: true,
})