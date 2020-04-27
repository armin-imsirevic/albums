import './css/main.css';

import { IOptions } from './interfaces';
import { createAlbumSectionEl, createSearchInputEl, createBackLinkEl, createNoResultsEl, createInvalidArtistIDEl, createPageTitleEl } from './elements';
import { fetchAlbumInfo } from './api';
import { artistURLRegex, getPagination } from './helpers';

export const displayAlbums = async (options?: IOptions) => {

    const { limit, page } = getPagination();
    const { artistId, query } = options || {};

    const albums = await fetchAlbumInfo({...options, limit, page});

    const searchContainer = document.querySelector('div.search-container');
    const titleContainer = document.querySelector('div.title');
    const paginationEl = document.querySelector('.pagination');
    const backLink = createBackLinkEl();

    // Sets up title header and search input
    if (!artistId && !document.querySelector('input#search')) {
        searchContainer.innerHTML = '';
        titleContainer.innerHTML = '';

        paginationEl.classList.remove('hide');
        const searchInputEl = createSearchInputEl();
        searchContainer.appendChild(searchInputEl);
        titleContainer.innerHTML = 'Album list';
        if (artistURLRegex.test(window.location.pathname)) {
            window.history.pushState('', 'Album list', '/');
        }
    } else if (artistId && albums.length && !document.querySelector('a.back-link')) {
        paginationEl.classList.add('hide');
        searchContainer.innerHTML = '';
        titleContainer.innerHTML = '';

        const titleEl = createPageTitleEl(albums[0].artist.title);
        titleContainer.appendChild(backLink);
        titleContainer.appendChild(titleEl);
        window.history.pushState('', artistId, `/artist/${artistId}`);
    }

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

    const albumSections = albums.map((album) => createAlbumSectionEl(album));

    for (const albumSection of albumSections) {
        content.appendChild(albumSection);
    }
}

const loadPage = () => {
    const pathName = window.location.pathname;
    if(artistURLRegex.test(pathName)) {
        const artistId = pathName.split('/')[2];
        displayAlbums({artistId}).catch(displayError);
    } else {
        displayAlbums().catch(displayError);
    }
}

const displayError = () => {
    const content = document.querySelector('div.content');
    content.innerHTML = 'Something went wrong! Try to refresh!';

    const titleContainer = document.querySelector('div.title');
    titleContainer.innerHTML = 'Error';
}

const setSelectEvent = () => {
    const searchEl: HTMLInputElement = document.querySelector('#search');
    searchEl ? searchEl.value = null : null;
    loadPage();
}

const limitEl = document.querySelector('#limit');
const pageEl = document.querySelector('#page');

limitEl.addEventListener('change', setSelectEvent);
pageEl.addEventListener('change', setSelectEvent);


window.addEventListener('load', loadPage);
window.addEventListener('popstate', loadPage);

