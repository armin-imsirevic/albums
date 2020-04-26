import './css/main.css';

import { debounce } from 'debounce';

import { IAlbum, IArtist } from './interfaces';

export const displayAlbums = (albums: IAlbum[]) => {
    const content = document.querySelector('div.content');
    content.innerHTML = '';

    albums.forEach((album) => {
        const section = document.createElement('section');
        const img = document.createElement('img');
        img.setAttribute('src', album.imageUrl)
        img.setAttribute('class', 'album-image')

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

        const releaseDateHolder = document.createElement('div');
        releaseDateHolder.setAttribute('class', 'album-release-date');
        const released = document.createElement('span');
        released.setAttribute('class', 'released');
        released.innerText = 'Released: ';
        releaseDateHolder.appendChild(released);
        releaseDateHolder.innerHTML += ' '+new Date(album.releaseDate).getFullYear();

        const price = document.createElement('div');
        price.setAttribute('class', 'album-price');
        price.innerText = album.price;

        const favoriteHolder = document.createElement('div');
        favoriteHolder.setAttribute('class', 'album-favorite');
        if (album.favorite) {
            const aLink = document.createElement('a');
            aLink.setAttribute('class', 'album-remove-link');
            aLink.innerText = 'Remove favorite';
            favoriteHolder.appendChild(aLink);
        } else {
            const button = document.createElement('button');
            button.setAttribute('class', 'album-favorite-button');
            button.innerText = 'MARK AS FAVORITE';
            favoriteHolder.appendChild(button);
        }

        section.appendChild(img);
        section.appendChild(titleHolder);
        section.appendChild(releaseDateHolder);
        section.appendChild(price);
        section.appendChild(favoriteHolder);

        content.appendChild(section);
    });
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
    const artistFullData = albumsData.map((album) => {
        const artist = artistsData.find((artist) => artist.id === album.artistId);
        return {...album, artist} as IAlbum;
    });
    displayAlbums(artistFullData);
}

export const fetchArtist = (id: number): void => {
    fetch(`/artists/${id}`)
        .then((res: Response) => res.json())
        .then((data: IArtist) => data);
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
    displayAlbums(artistFullData);
}

export const changeFavorite = (id: number, favorite: boolean): void => {
    fetch(`/albums/${id}`, {method: 'put', body: JSON.stringify({favorite: favorite})})
        .then((res: Response) => res.json())
        .then((data) => console.log(data));
}

export const putAlbumData = (album: IAlbum): void => {
    console.log({...album, favorite: !album.favorite});
    fetch(
        `/albums/${album.id}`,
        {
            headers: { 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify({...album, favorite: !album.favorite} as IAlbum),
        },
    ).then((res: Response) => res.json())
     .then((data) => console.log(data));
}

window.addEventListener('load', () => {
    if(document.querySelector('main#albums')) {
        const searchInput = document.getElementById('search');
        searchInput.addEventListener('input', debounce((e: any) => fetchAlbumsByQuery(e.target.value), 500));
        fetchAlbumInfo();
    }
    // } else {

    // }
});
