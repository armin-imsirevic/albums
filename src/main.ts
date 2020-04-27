import './css/main.css';

import { IAlbum, IDisplayOptions } from './interfaces';
import { createAlbumSection, createSearchInputEl, createBackLinkEl } from './elements';
import { requestUpdateAlbum, fetchAlbumInfo, fetchArtistInfo, fetchAlbumsByQuery } from './api';
import { artistURLRegex } from './helpers';

export const displayPage = async (options?: IDisplayOptions) => {

    const { artistId, query } = options || {};
    const albums = artistId ?
        await fetchArtistInfo(artistId)
        : query ?
            await fetchAlbumsByQuery(query)
            : await fetchAlbumInfo();

    const searchContainer = document.querySelector('div.search-container');
    const titleContainer = document.querySelector('div.title');

    if (!artistId && !document.querySelector('input#search')) {
        searchContainer.innerHTML = '';
        const searchInputEl = createSearchInputEl();
        searchContainer.appendChild(searchInputEl);
        titleContainer.innerHTML = 'Album list';
        if (artistURLRegex.test(window.location.pathname)) {
            window.history.replaceState('', 'Album list', `/`);
            window.location.href = window.location.href
        }
    } else if (artistId && albums.length && !document.querySelector('a.back-link')) {
        searchContainer.innerHTML = '';
        titleContainer.innerHTML = albums[0].artist.title;
        const backLink = createBackLinkEl();
        searchContainer.appendChild(backLink);
        window.history.replaceState('', artistId, `/artist/${artistId}`);
    }

    const content = document.querySelector('div.content');
    content.innerHTML = '';

    const albumSections = albums.map((album) => createAlbumSection(album));

    for (const albumSection of albumSections) {
        content.appendChild(albumSection);
    }
}



export const updateAlbum = async (album: IAlbum): Promise<void> => {
    await requestUpdateAlbum({...album, favorite: !album.favorite, artist: undefined});
    const newSection = createAlbumSection({...album, favorite: !album.favorite} );
    document.querySelector(`section#a${album.id}`).replaceWith(newSection);
};

const loadPage = () => {
    const pathName = window.location.pathname;
    if(artistURLRegex.test(pathName)) {
        const artistId = pathName.split('/')[2];
        displayPage({artistId}).catch((e) => console.log(e));
    } else {
        displayPage().catch((e) => console.log(e));
    }
}

window.addEventListener('load', loadPage);
window.addEventListener('popstate', loadPage);