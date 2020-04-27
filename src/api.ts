import { IAlbum, IArtist, IQueryOptions } from './interfaces';
import { unique, constructQueryParamsString } from './helpers';

const requestAlbums = (options: IQueryOptions): Promise<Response> => {
    const queryParameters = constructQueryParamsString(options);
    return fetch(`/albums${queryParameters ? '/?' + queryParameters : ''}`);
}

const requestArtists = (queryIDs: string): Promise<Response> => fetch(`/artists/?id=${queryIDs}`);

const requestUpdateAlbum = (album: IAlbum): Promise<Response> => fetch(
    `/albums/${album.id}`,
    {
        headers: { 'Content-Type': 'application/json' },
        method: 'put',
        body: JSON.stringify(album),
    },
)

export const fetchAlbumInfo = async (options?: IQueryOptions): Promise<IAlbum[]> => {
    const albumsResponse = await requestAlbums(options);
    const albumsData: IAlbum[] = await albumsResponse.json();
    const artistsQuery = albumsData.map((a) => a.artistId).filter(unique).join('&id=');
    const artistsResponse = await requestArtists(artistsQuery);
    const artistsData: IArtist[] = await artistsResponse.json();

    const albumFullData = albumsData.map((album) => {
        const artist = artistsData.find((artist) => artist.id === album.artistId);
        return {...album, artist} as IAlbum;
    });

    return albumFullData;
}

export const updateAlbum = async (album: IAlbum): Promise<IAlbum> => {
    const albumResponse = await requestUpdateAlbum({...album, favorite: !album.favorite, artist: undefined});
    const updatedAlbum: IAlbum = await albumResponse.json();
    return {...updatedAlbum, artist: album.artist} as IAlbum;
};
