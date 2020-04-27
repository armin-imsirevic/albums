import './css/main.css';

import { IOptions } from './interfaces';
import { createAlbumSectionEl, createSearchInputEl, createBackLinkEl, createNoResultsEl, createInvalidArtistIDEl } from './elements';
import { fetchAlbumInfo } from './api';
import { artistURLRegex } from './helpers';

export const displayAlbums = async (options?: IOptions) => {
    const { artistId, query } = options || {};
    const albums = await fetchAlbumInfo(options);

    const searchContainer = document.querySelector('div.search-container');
    const titleContainer = document.querySelector('div.title');
    const backLink = createBackLinkEl();

    if (!artistId && !document.querySelector('input#search')) {
        searchContainer.innerHTML = '';
        const searchInputEl = createSearchInputEl();
        searchContainer.appendChild(searchInputEl);
        titleContainer.innerHTML = 'Album list';
        if (artistURLRegex.test(window.location.pathname)) {
            window.history.pushState('', 'Album list', '/');
        }
    } else if (artistId && albums.length && !document.querySelector('a.back-link')) {
        searchContainer.innerHTML = '';
        titleContainer.innerHTML = albums[0].artist.title;
        searchContainer.appendChild(backLink);
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
        searchContainer.appendChild(backLink);
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
        displayAlbums({artistId}).catch((e) => console.log(e));
    } else {
        displayAlbums().catch((e) => console.log(e));
    }
}

window.addEventListener('load', loadPage);
window.addEventListener('popstate', loadPage);