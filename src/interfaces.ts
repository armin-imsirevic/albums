export interface IAlbum {
    id: number;
    title: string;
    price: string;
    imageUrl: string;
    releaseDate: string;
    artistId: number;
    favorite: boolean;
    artist?: IArtist;
}

export interface IArtist {
    id: number;
    title: string;
}

export interface IOptions {
    artistId?: string;
    query?: string;
}

export interface IQueryOptions extends IOptions {
    limit: string;
}