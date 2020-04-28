import './css/main.css';

import {
    createAlbumSectionEl,
    createSearchInputEl,
    createBackLinkEl,
    createNoResultsEl,
    createInvalidArtistIDEl,
    createPageTitleEl,
} from './elements';
import {
    artistURLRegex,
    getPagination,
    showLoaderOnFunctionAwait
} from './helpers';
import { fetchAlbumInfo } from './api';
import { IOptions } from './interfaces';

export const displayAlbums = async (options?: IOptions) => {
    const isHome = window.history.state.home;
    const { limit, page } = getPagination();
    const { artistId, query } = options || {};

    const albums = await fetchAlbumInfo({...options, limit, page});

    const searchContainer = document.querySelector('div.search-container');
    const titleContainer = document.querySelector('div.title');
    const paginationEl = document.querySelector('.pagination');
    const backLink = createBackLinkEl();

    // Sets up title header and search input
    if (isHome) {
        titleContainer.innerHTML = '';

        const existingSearchEl  = document.querySelector('input#search')
        if (!existingSearchEl) {
            searchContainer.innerHTML = '';
            const searchInputEl = createSearchInputEl();
            searchContainer.appendChild(searchInputEl);
        }
        titleContainer.innerHTML = 'Album list';

        if (paginationEl.classList.contains('hide')) {
            paginationEl.classList.remove('hide')
        };

    } else if (artistId && albums.length && !document.querySelector('a.back-link')) {
        if (!paginationEl.classList.contains('hide')) {
            paginationEl.classList.add('hide')
        };

        const backLink = document.querySelector('a.back-link');
        const artistTitle = document.querySelector('div.title > div');
        if (!backLink || !artistTitle) {
            searchContainer.innerHTML = '';
            titleContainer.innerHTML = '';
            const backLinkEl = createBackLinkEl();
            const titleEl = createPageTitleEl(albums[0].artist.title);
            titleContainer.appendChild(backLinkEl);
            titleContainer.appendChild(titleEl);
        }
    }

    // Setup album sections
    const content = document.querySelector('div.content');
    content.innerHTML = '';

    if (query && !Boolean(albums.length)) {
        const noResultsEl = createNoResultsEl(query);
        content.appendChild(noResultsEl);
        return;
    }

    if (artistId && !Boolean(albums.length)) {
        const invalidIDEl = createInvalidArtistIDEl(artistId);
        titleContainer.appendChild(backLink);
        content.appendChild(invalidIDEl);
        return;
    }

    const albumSections = albums.map((album) => createAlbumSectionEl(album, Boolean(artistId)));

    for (const albumSection of albumSections) {
        content.appendChild(albumSection);
    }
}

const loadPage = async () => {
    const pathName = window.location.pathname;
    const isArtistPage = artistURLRegex.test(pathName);
    isArtistPage ? window.history.pushState({home: false}, 'Artist page') : window.history.pushState({home: true}, 'Home page');
    const artistId = isArtistPage ? pathName.split('/')[2] : undefined;
    await displayAlbums({artistId}).catch(displayError);
}

const displayError = () => {
    const content = document.querySelector('div.content');
    content.innerHTML = 'Something went wrong! Try to refresh!';

    const titleContainer = document.querySelector('div.title');
    titleContainer.innerHTML = 'Error';
}

const setSelectEvent = async () => {
    window.history.pushState({home: true}, 'Home page', '/')
    const searchEl: HTMLInputElement = document.querySelector('#search');
    if(searchEl) {
        searchEl.value = null
    };
    await showLoaderOnFunctionAwait(loadPage);
}

const limitEl = document.querySelector('#limit');
const pageEl = document.querySelector('#page');

limitEl.addEventListener('change', setSelectEvent);
pageEl.addEventListener('change', setSelectEvent);

window.addEventListener('load', async () => await showLoaderOnFunctionAwait(loadPage));
window.addEventListener('popstate', async () => await showLoaderOnFunctionAwait(loadPage));

//remove display:none on body after main.js loads
document.body.removeAttribute('style');
