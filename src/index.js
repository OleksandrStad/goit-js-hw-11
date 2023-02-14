import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImg } from './fetchPicture';

const ref = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
    hideButton: document.querySelector('.load__more'),
    loader: document.getElementById('loading'),
};
// __________________________________________

function renderImg(ref, data) {
    const markup = data.map(el => {
        return `<div class="photo-card">
    <a href="${el.largeImageURL}">
      <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>
      ${el.likes}
    </p>
    <p class="info-item">
      <b>Views: </b>
      ${el.views}
    </p>
    <p class="info-item">
      <b>Comments: </b>
      ${el.comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>
      ${el.downloads}
    </p>
  </div>
</div>`;
    });

    ref.gallery.insertAdjacentHTML('beforeend', markup);
}
// __________________________________________________________
let page = 1;
let textContent = '';
const observer = new IntersectionObserver(
    callbackObserver,
    getOptionObserver()
);

ref.form.addEventListener('submit', fetchAndRenderImg);
ref.loader.style.display = 'none';

async function fetchAndRenderImg(e) {
    e.preventDefault();
    ref.loader.style.display = 'none';
    textContent = e.currentTarget.searchQuery.value;
    clearData();
    if (textContent === '') {
        clearData();
        return Notify.warning(
            'Sorry, there are no images matching your search query. Please try again.'
        );
    }
    try {
        const image = await fetchImg(textContent, page);
        const data = await image.data.hits;
        if (data.length === 0) {
            return Notify.warning(
                'Sorry, there are no images matching your search query. Please try again.'
            );
        } else {
            Notify.success(`Hooray! We found ${image.data.totalHits} images.`);
        }

        renderImg(ref, data);

        ref.loader.style.display = 'block';
    } catch (error) {
        console.log(error);
    }
}

async function onLoadMore() {
    page += 1;

    if (page > totalPages) {
        page = 1;
        ref.loader.style.display = 'none';
    }

    if (textContent === '') {
        ref.loader.style.display = 'none';
        return clearData();
    }
    try {
        const image = await fetchImg(textContent, page);
        const data = await image.data.hits;
        const totalPages = (await image.data.totalHits) / 40;

        renderImg(ref, data);
        smoothScroll();

    } catch (error) {
        console.log(error);
    }
}

function smoothScroll() {
    const { height: cardHeight } =
        ref.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}

function clearData() {
    ref.gallery.innerHTML = '';
}

function getOptionObserver() {
    return {
        root: null,
        rootMargin: '0px',
        threshold: 0.25,
    };
}
function callbackObserver(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            onLoadMore();
        }
    });
}
observer.observe(ref.loader);