import { IAlbum } from './interfaces';
import { displayAlbums } from './main';
import { debounce } from 'debounce';
import { updateAlbum } from './api';
import { setPaginationToDefault, showLoaderOnFunctionWait } from './helpers';

const createAlbumImgEl = (album: IAlbum, disableEventListeners: boolean): HTMLImageElement => {
    const img = document.createElement('img');
    img.setAttribute('src', album.imageUrl);
    img.setAttribute('class', 'album-image');

    if (!disableEventListeners) {
        img.addEventListener('click', () => showLoaderOnFunctionWait(() => {
            window.history.pushState({home: false}, album.artistId + '', `/artist/${album.artistId}`);
            return displayAlbums({artistId: album.artist.id.toString()});
        }));
    }

    return img;
}

const createSectionTitleEl = (album: IAlbum, disableEventListeners: boolean): HTMLDivElement => {
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

    if (!disableEventListeners) {
        titleHolder.addEventListener('click', () => displayAlbums({artistId: album.artist.id.toString()}));
    }

    return titleHolder;
}

const createReleaseDateEl = (album: IAlbum): HTMLDivElement => {
    const releaseDateHolder = document.createElement('div');
    releaseDateHolder.setAttribute('class', 'album-release-date');
    const released = document.createElement('span');
    released.setAttribute('class', 'dsc');
    released.innerText = 'Released: ';
    releaseDateHolder.appendChild(released);
    releaseDateHolder.innerHTML += ' ' + new Date(album.releaseDate).getFullYear();

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

const createFavoriteLinkEl = (album: IAlbum, disableEventListeners: boolean): HTMLAnchorElement => {
    const aLink = document.createElement('a');
    aLink.setAttribute('class', 'album-favorite-link');
    aLink.addEventListener('click', () => showLoaderOnFunctionWait(() => updateAlbumSection(album, disableEventListeners)));
    aLink.innerText = 'Remove favorite';

    return aLink;
}

const createFavoriteButtonEl = (album: IAlbum, disableEventListeners: boolean): HTMLButtonElement => {
    const button = document.createElement('button');
    button.setAttribute('class', 'album-favorite-button');
    button.addEventListener('click', () => showLoaderOnFunctionWait(() => updateAlbumSection(album, disableEventListeners)));
    button.innerText = 'MARK AS FAVORITE';

    return button;
}

const createFavoriteEl = (album: IAlbum, disableEventListeners: boolean): HTMLDivElement => {
    const favoriteHolder = document.createElement('div');
    favoriteHolder.setAttribute('class', 'album-favorite');

    if (album.favorite) {
        const aLink = createFavoriteLinkEl(album, disableEventListeners);
        favoriteHolder.appendChild(aLink);
    } else {
        const button = createFavoriteButtonEl(album, disableEventListeners);
        favoriteHolder.appendChild(button);
    }

    return favoriteHolder;
}

const updateAlbumSection = async (album: IAlbum, disableEventListeners: boolean): Promise<void> => {
    const updatedAlbum = await updateAlbum(album);
    const newSection = createAlbumSectionEl(updatedAlbum, disableEventListeners);
    const oldSection = document.querySelector(`section#a${updatedAlbum.id}`);
    if (oldSection) {
        oldSection.replaceWith(newSection);
    }
}

export const createNoResultsEl = (query: string): HTMLDivElement => {
    const noEl = document.createElement('div');
    noEl.setAttribute('class', 'text-center');
    noEl.innerText = `No search results for '${query}'!`

    return noEl;
}


export const createInvalidArtistIDEl = (artistId: string): HTMLDivElement => {
    const el = document.createElement('div');
    el.setAttribute('class', 'text-center');
    el.innerText = `Artist with id '${artistId}' doesn't exist!`

    return el;
}

export const createAlbumSectionEl = (album: IAlbum, disableEventListeners: boolean) => {
    const section = document.createElement('section');
    section.setAttribute('id', 'a'+album.id);

    const imgEl = createAlbumImgEl(album, disableEventListeners);
    const sectionTitlesEl = createSectionTitleEl(album, disableEventListeners);
    const releaseDateEl = createReleaseDateEl(album);
    const priceEl = createPriceEl(album);
    const favoriteEl = createFavoriteEl(album, disableEventListeners);

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
    searchInput.setAttribute('class', 'search-loaded');
    searchInput.setAttribute('placeholder', 'Search');
    searchInput.addEventListener('input', searchInputOnChangeFun(searchInput));
    return searchInput;
}

const searchInputOnChangeFun = (searchInput: HTMLInputElement) => debounce(async (e: any) => {
    if (searchInput.classList.contains('search-loaded')) {
        searchInput.classList.replace('search-loaded', 'search-loading');
    }
    await displayAlbums({query: e.target.value});
    if (searchInput.classList.contains('search-loading')) {
        searchInput.classList.replace('search-loading', 'search-loaded');
    }
}, 500);

export const createBackLinkEl = (): HTMLAnchorElement => {
    const backLink = document.createElement('a');
    backLink.setAttribute('class', 'back-link')
    backLink.innerText = '< ';
    backLink.addEventListener('click', () => {
        window.history.pushState({home: true}, '', '/');
        setPaginationToDefault();
        showLoaderOnFunctionWait(displayAlbums);
    });
    return backLink;
}

export const createPageTitleEl = (pageTitle: string): HTMLDivElement => {
    const pageTitleEl = document.createElement('div');
    pageTitleEl.innerText = pageTitle;
    return pageTitleEl;
}


