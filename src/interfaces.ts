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

export interface IDisplayOptions {
    artistId?: string;
    query?: string;
}