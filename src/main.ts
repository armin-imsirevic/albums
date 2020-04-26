import './css/main.css';

import { debounce } from 'debounce';

import { IAlbum, IArtist } from './interfaces';

export const displayPage = (albums: IAlbum[], isHome: boolean) => {
    const searchContainer = document.querySelector('div.search-container');
    const titleContainer = document.querySelector('div.title');

    if (isHome && !document.querySelector('input#search')) {
        searchContainer.innerHTML = '';
        const searchInput = document.createElement('input');
        searchInput.setAttribute('id', 'search');
        searchInput.setAttribute('placeholder', 'Search');
        searchInput.addEventListener('input', debounce((e: any) => fetchAlbumsByQuery(e.target.value), 500));

        searchContainer.appendChild(searchInput);
        titleContainer.innerHTML = 'Album list';
    } else if (!isHome && albums.length && !document.querySelector('a.back-link')) {
        searchContainer.innerHTML = '';

        titleContainer.innerHTML = albums[0].artist.title;

        const backLink = document.createElement('a');
        backLink.setAttribute('class', 'back-link')
        backLink.innerText = '< Back';
        backLink.addEventListener('click', () => fetchAlbumInfo());

        searchContainer.appendChild(backLink);
    }

    const content = document.querySelector('div.content');
    content.innerHTML = '';

    const albumSections = albums.map((album) => createAlbumSection(album));

    for (const albumSection of albumSections) {
        content.appendChild(albumSection);
    }
}

const createAlbumSection = (album: IAlbum) => {
    const section = document.createElement('section');
    section.setAttribute('id', 'a'+album.id);
    const img = document.createElement('img');
    img.setAttribute('src', album.imageUrl);
    img.setAttribute('class', 'album-image');
    img.addEventListener('click', () => fetchArtistInfo(album.artist.id));

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
    titleHolder.addEventListener('click', () => fetchArtistInfo(album.artist.id));

    const releaseDateHolder = document.createElement('div');
    releaseDateHolder.setAttribute('class', 'album-release-date');
    const released = document.createElement('span');
    released.setAttribute('class', 'dsc');
    released.innerText = 'Released: ';
    releaseDateHolder.appendChild(released);
    releaseDateHolder.innerHTML += ' '+new Date(album.releaseDate).getFullYear();

    const price = document.createElement('div');
    price.setAttribute('class', 'album-price');
    const priceText = document.createElement('span');
    priceText.setAttribute('class', 'dsc');
    priceText.innerText = 'Price: ';
    price.appendChild(priceText);
    price.innerHTML += album.price;

    const favoriteHolder = document.createElement('div');
    favoriteHolder.setAttribute('class', 'album-favorite');
    if (album.favorite) {
        const aLink = document.createElement('a');
        aLink.setAttribute('class', 'album-favorite-link');
        aLink.addEventListener('click', () => putAlbumData(album));
        aLink.innerText = 'Remove favorite';

        favoriteHolder.appendChild(aLink);
    } else {
        const button = document.createElement('button');
        button.setAttribute('class', 'album-favorite-button');
        button.addEventListener('click', () => putAlbumData(album));
        button.innerText = 'MARK AS FAVORITE';

        favoriteHolder.appendChild(button);
    }

    section.appendChild(img);
    section.appendChild(titleHolder);
    section.appendChild(releaseDateHolder);
    section.appendChild(price);
    section.appendChild(favoriteHolder);

    return section;
}

const unique = (value: any, index: number, self: any) => {
    return self.indexOf(value) === index
}

export const fetchAlbumInfo = async (): Promise<void> => {
    const urlParams = new URLSearchParams(window.location.search);
    const limit = urlParams.has('limit') ? urlParams.get('limit') : 10;
    const albumsResponse = await fetch(`/albums/?_limit=${limit}`);
    const albumsData: IAlbum[] = await albumsResponse.json();
    const artistsQuery = albumsData.map((a) => a.artistId).filter(unique).join('&id=');
    const artistsResponse = await fetch(`/artists/?id=${artistsQuery}`);
    const artistsData: IArtist[] = await artistsResponse.json();
    const albumFullData = albumsData.map((album) => {
        const artist = artistsData.find((artist) => artist.id === album.artistId);
        return {...album, artist} as IAlbum;
    });
    window.history.pushState('', 'Album list', `/`);
    displayPage(albumFullData, true);
}

export const fetchArtistInfo = async (artistID: string | number): Promise<void> => {
    const artistsResponse = await fetch(`/artists/?id=${artistID}`);
    const artistData: IArtist[] = await artistsResponse.json();
    const albumsResponse = await fetch(`/albums/?artistId=${artistID}`);
    const albumsData: IAlbum[] = await albumsResponse.json();
    const albumFullData = albumsData.map((album) => ({...album, artist: artistData[0]} as IAlbum));
    window.history.pushState('', artistData[0].title, `/artist/${artistData[0].id}`);
    displayPage(albumFullData, false);
}

export const fetchAlbumsByQuery = async (query: string): Promise<void> => {
    const urlParams = new URLSearchParams(window.location.search);
    const limit = urlParams.has('limit') ? urlParams.get('limit') : 10;
    const albumsResponse = await fetch(`/albums/?_limit=${limit}&q=${query}`);
    const albumsData: IAlbum[] = await albumsResponse.json();
    const artistsQuery = albumsData.map((a) => a.artistId).filter(unique).join('&id=');
    const artistsResponse = await fetch(`/artists/?id=${artistsQuery}`);
    const artistsData: IArtist[] = await artistsResponse.json();
    const artistFullData = albumsData.map((album) => {
        const artist = artistsData.find((artist) => artist.id === album.artistId);
        return {...album, artist} as IAlbum;
    });
    displayPage(artistFullData, true);
}

export const putAlbumData = async (album: IAlbum): Promise<void> => {
    const albumData = {...album, favorite: !album.favorite} as IAlbum;
    await fetch(
        `/albums/${album.id}`,
        {
            headers: { 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify(albumData),
        },
    )
    const section = createAlbumSection(albumData);
    document.querySelector(`section#a${albumData.id}`).replaceWith(section);
}

const loadPage = () => {
    const artistRegex = /^\/artist\/\d+$/g;
    const pathName = window.location.pathname;
    if(artistRegex.test(pathName)) {
        const artistID = pathName.split('/')[2];
        fetchArtistInfo(artistID).catch((e) => console.log(e));
    } else {
        fetchAlbumInfo().catch((e) => console.log(e));
    }
}

window.addEventListener('load', loadPage);
window.addEventListener('popstate', loadPage);