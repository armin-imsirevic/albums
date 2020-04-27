import { IAlbum } from './interfaces';
import { updateAlbum, displayPage } from './main';
import { debounce } from 'debounce';

const createAlbumImgEl = (album: IAlbum): HTMLImageElement => {
    const img = document.createElement('img');
    img.setAttribute('src', album.imageUrl);
    img.setAttribute('class', 'album-image');
    img.addEventListener('click', () => displayPage(album.artist.id.toString()));
    return img;
}

const createSectionTitleEl = (album: IAlbum): HTMLDivElement => {
    const titleHolder = document.createElement('div');
    titleHolder.setAttribute('class', 'title-holder');
    const albumTitle = document.createElement('div');
    albumTitle.setAttribute('class', 'album-title');
    albumTitle.innerText = album.title;
    const artistTitle = document.createElement('div');
    artistTitle.setAttribute('class', 'artist-title');
    artistTitle.innerText = album.artist.title;
    titleHolder.appendChild(albumTitle);
    titleHolder.appendChild(artistTitle);
    titleHolder.addEventListener('click', () => displayPage(album.artist.id.toString()));
    return titleHolder;
}

const createReleaseDateEl = (album: IAlbum): HTMLDivElement => {
    const releaseDateHolder = document.createElement('div');
    releaseDateHolder.setAttribute('class', 'album-release-date');
    const released = document.createElement('span');
    released.setAttribute('class', 'dsc');
    released.innerText = 'Released: ';
    releaseDateHolder.appendChild(released);
    releaseDateHolder.innerHTML += ' '+new Date(album.releaseDate).getFullYear();

    return releaseDateHolder;
}

const createPriceEl = (album: IAlbum): HTMLDivElement => {
    const price = document.createElement('div');
    price.setAttribute('class', 'album-price');
    const priceText = document.createElement('span');
    priceText.setAttribute('class', 'dsc');
    priceText.innerText = 'Price: ';
    price.appendChild(priceText);
    price.innerHTML += album.price;

    return price;
}

const createFavoriteLinkEl = (album: IAlbum): HTMLAnchorElement => {
    const aLink = document.createElement('a');
    aLink.setAttribute('class', 'album-favorite-link');
    aLink.addEventListener('click', () => updateAlbum(album));
    aLink.innerText = 'Remove favorite';

    return aLink;
}

const createFavoriteButtonEl = (album: IAlbum): HTMLButtonElement => {
    const button = document.createElement('button');
    button.setAttribute('class', 'album-favorite-button');
    button.addEventListener('click', () => updateAlbum(album));
    button.innerText = 'MARK AS FAVORITE';

    return button;
}

const createFavoriteEl = (album: IAlbum): HTMLDivElement => {
    const favoriteHolder = document.createElement('div');
    favoriteHolder.setAttribute('class', 'album-favorite');

    if (album.favorite) {
        const aLink = createFavoriteLinkEl(album);
        favoriteHolder.appendChild(aLink);
    } else {
        const button = createFavoriteButtonEl(album);
        favoriteHolder.appendChild(button);
    }

    return favoriteHolder;
}

export const createAlbumSection = (album: IAlbum) => {
    const section = document.createElement('section');
    section.setAttribute('id', 'a'+album.id);

    const imgEl = createAlbumImgEl(album);
    const sectionTitlesEl = createSectionTitleEl(album);
    const releaseDateEl = createReleaseDateEl(album);
    const priceEl = createPriceEl(album);
    const favoriteEl = createFavoriteEl(album);

    section.appendChild(imgEl);
    section.appendChild(sectionTitlesEl);
    section.appendChild(releaseDateEl);
    section.appendChild(priceEl);
    section.appendChild(favoriteEl);

    return section;
}

export const createSearchInputEl = (): HTMLInputElement => {
    const searchInput = document.createElement('input');
    searchInput.setAttribute('id', 'search');
    searchInput.setAttribute('placeholder', 'Search');
    searchInput.addEventListener('input', debounce((e: any) => displayPage(undefined, e.target.value), 500));
    return searchInput;
}

export const createBackLinkEl = (): HTMLAnchorElement => {
    const backLink = document.createElement('a');
    backLink.setAttribute('class', 'back-link')
    backLink.innerText = '< Back';
    backLink.addEventListener('click', () => displayPage());
    return backLink;
}
