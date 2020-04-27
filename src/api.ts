import { IAlbum, IArtist } from './interfaces';
import { unique} from './helpers';

export const requestUpdateAlbum = (album: IAlbum) => fetch(
    `/albums/${album.id}`,
    {
        headers: { 'Content-Type': 'application/json' },
        method: 'put',
        body: JSON.stringify(album),
    },
)

export const fetchAlbumInfo = async (): Promise<IAlbum[]> => {
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
    return albumFullData;
}

export const fetchArtistInfo = async (artistId: string | number): Promise<IAlbum[]> => {
    const artistsResponse = await fetch(`/artists/?id=${artistId}`);
    const artistData: IArtist[] = await artistsResponse.json();
    const albumsResponse = await fetch(`/albums/?artistId=${artistId}`);
    const albumsData: IAlbum[] = await albumsResponse.json();
    const albumFullData = albumsData.map((album) => ({...album, artist: artistData[0]} as IAlbum));
    return albumFullData;
}

export const fetchAlbumsByQuery = async (query: string): Promise<IAlbum[]> => {
    const urlParams = new URLSearchParams(window.location.search);
    const limit = urlParams.has('limit') ? urlParams.get('limit') : 10;
    const albumsResponse = await fetch(`/albums/?_limit=${limit}&q=${query}`);
    const albumsData: IAlbum[] = await albumsResponse.json();
    const artistsQuery = albumsData.map((a) => a.artistId).filter(unique).join('&id=');
    const artistsResponse = await fetch(`/artists/?id=${artistsQuery}`);
    const artistsData: IArtist[] = await artistsResponse.json();
    const albumsFullData = albumsData.map((album) => {
        const artist = artistsData.find((artist) => artist.id === album.artistId);
        return {...album, artist} as IAlbum;
    });
    return albumsFullData;
}